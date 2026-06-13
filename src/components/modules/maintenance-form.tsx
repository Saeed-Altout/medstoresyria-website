"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateMaintenanceDto } from "@/types";

const schema = z.object({
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_phone: z.string().min(6),
  device_type: z.string().min(2),
  description: z.string().min(10),
  visit_type: z.enum(["home", "office"]),
});

type FormValues = z.infer<typeof schema>;

export function MaintenanceForm({
  submitting,
  onSubmit,
}: {
  submitting: boolean;
  onSubmit: (dto: CreateMaintenanceDto) => void;
}) {
  const t = useTranslations("maintenance");
  const locale = useLocale();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      device_type: "",
      description: "",
      visit_type: "home",
    },
  });

  const submit = form.handleSubmit((values) =>
    onSubmit({ ...values, locale }),
  );
  const errors = form.formState.errors;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="m_name">{t("fullName")}</FieldLabel>
          <Input id="m_name" {...form.register("customer_name")} />
          {errors.customer_name && <FieldError>{t("errors.name")}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="m_phone">{t("phone")}</FieldLabel>
          <Input id="m_phone" {...form.register("customer_phone")} />
          {errors.customer_phone && <FieldError>{t("errors.phone")}</FieldError>}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="m_email">{t("email")}</FieldLabel>
        <Input id="m_email" type="email" {...form.register("customer_email")} />
        {errors.customer_email && <FieldError>{t("errors.email")}</FieldError>}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="m_device">{t("deviceType")}</FieldLabel>
          <Input
            id="m_device"
            placeholder={t("devicePlaceholder")}
            {...form.register("device_type")}
          />
          {errors.device_type && <FieldError>{t("errors.device")}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="m_visit">{t("visitType")}</FieldLabel>
          <Select
            value={form.watch("visit_type")}
            onValueChange={(v) =>
              form.setValue("visit_type", v as FormValues["visit_type"])
            }
          >
            <SelectTrigger id="m_visit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">{t("visit.home")}</SelectItem>
              <SelectItem value="office">{t("visit.office")}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="m_desc">{t("description")}</FieldLabel>
        <Textarea
          id="m_desc"
          rows={4}
          placeholder={t("descPlaceholder")}
          {...form.register("description")}
        />
        {errors.description && <FieldError>{t("errors.description")}</FieldError>}
      </Field>

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
