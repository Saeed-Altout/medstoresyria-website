"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGovernorates } from "@/lib/hooks/commerce";
import { useAuthStore } from "@/stores/auth.store";
import { formatPrice } from "@/lib/utils/format";
import type { CartItem, CreateOrderDto } from "@/types";

const schema = z.object({
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_phone: z.string().min(6),
  governorate_id: z.string().uuid(),
  address_detail: z.string().min(10),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof schema>;

interface CheckoutFormProps {
  items: CartItem[];
  subtotal: number;
  submitting: boolean;
  onSubmit: (dto: CreateOrderDto) => void;
}

export function CheckoutForm({
  items,
  subtotal,
  submitting,
  onSubmit,
}: CheckoutFormProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const user = useAuthStore((s) => s.user);
  const { data: governorates } = useGovernorates();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      governorate_id: "",
      address_detail: "",
      notes: "",
    },
  });

  // Prefill from logged-in profile.
  useEffect(() => {
    if (user) {
      form.reset({
        customer_name: `${user.first_name} ${user.last_name}`.trim(),
        customer_email: user.email,
        customer_phone: user.phone ?? "",
        governorate_id: "",
        address_detail: "",
        notes: "",
      });
    }
  }, [user, form]);

  const selectedGovId = form.watch("governorate_id");
  const selectedGov = governorates?.find((g) => g.id === selectedGovId);
  const deliveryFee = selectedGov ? parseFloat(selectedGov.delivery_fee_usd) : 0;
  const total = subtotal + deliveryFee;

  const submit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      locale,
      items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
    });
  });

  const errors = form.formState.errors;

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-3">
      {/* Shipping details */}
      <div className="space-y-4 lg:col-span-2">
        <h2 className="text-lg font-semibold">{t("shippingDetails")}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="customer_name">{t("fullName")}</FieldLabel>
            <Input id="customer_name" {...form.register("customer_name")} />
            {errors.customer_name && <FieldError>{t("errors.name")}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="customer_phone">{t("phone")}</FieldLabel>
            <Input id="customer_phone" {...form.register("customer_phone")} />
            {errors.customer_phone && <FieldError>{t("errors.phone")}</FieldError>}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="customer_email">{t("email")}</FieldLabel>
          <Input id="customer_email" type="email" {...form.register("customer_email")} />
          {errors.customer_email && <FieldError>{t("errors.email")}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="governorate_id">{t("governorate")}</FieldLabel>
          <Select
            value={selectedGovId}
            onValueChange={(v) =>
              form.setValue("governorate_id", v, { shouldValidate: true })
            }
          >
            <SelectTrigger id="governorate_id">
              <SelectValue placeholder={t("selectGovernorate")} />
            </SelectTrigger>
            <SelectContent>
              {governorates?.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {(locale === "ar" && g.name_local) || g.name} —{" "}
                  {formatPrice(g.delivery_fee_usd)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.governorate_id && (
            <FieldError>{t("errors.governorate")}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="address_detail">{t("address")}</FieldLabel>
          <Textarea
            id="address_detail"
            rows={3}
            placeholder={t("addressPlaceholder")}
            {...form.register("address_detail")}
          />
          {errors.address_detail && (
            <FieldError>{t("errors.address")}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="notes">{t("notes")}</FieldLabel>
          <Textarea id="notes" rows={2} {...form.register("notes")} />
        </Field>
      </div>

      {/* Order summary */}
      <Card className="h-fit p-6 lg:sticky lg:top-20">
        <h2 className="mb-4 font-semibold">{t("orderSummary")}</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-2">
              <span className="line-clamp-1 text-muted-foreground">
                {i.name} × {i.quantity}
              </span>
              <span className="shrink-0">
                {formatPrice(parseFloat(i.price_usd) * i.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <Separator className="my-4" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("delivery")}</span>
            <span>
              {selectedGov ? formatPrice(deliveryFee) : t("selectGovFirst")}
            </span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between text-base font-semibold">
          <span>{t("total")}</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Button
          type="submit"
          size="lg"
          className="mt-6 w-full"
          disabled={submitting || items.length === 0}
        >
          {submitting ? t("placing") : t("placeOrder")}
        </Button>
      </Card>
    </form>
  );
}
