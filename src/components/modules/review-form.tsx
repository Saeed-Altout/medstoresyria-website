"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { StarRating } from "@/components/modules/star-rating";
import { useCreateReview } from "@/lib/hooks/reviews";
import { useAuthStore } from "@/stores/auth.store";

const schema = z.object({
  author_name: z.string().min(2),
  author_email: z.string().email(),
  title: z.string().optional(),
  body: z.string().min(10),
});
type FormValues = z.infer<typeof schema>;

export function ReviewForm({ productId }: { productId: string }) {
  const t = useTranslations("reviews");
  const user = useAuthStore((s) => s.user);
  const createReview = useCreateReview();
  const [rating, setRating] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      author_name: user ? `${user.first_name} ${user.last_name}`.trim() : "",
      author_email: user?.email ?? "",
      title: "",
      body: "",
    },
  });

  const submit = form.handleSubmit((values) => {
    if (rating < 1) {
      toast.error(t("ratingRequired"));
      return;
    }
    createReview.mutate(
      { productId, rating, ...values, title: values.title || undefined },
      {
        onSuccess: () => {
          form.reset();
          setRating(0);
        },
      },
    );
  });

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border p-5">
      <h3 className="font-semibold">{t("write")}</h3>

      <Field>
        <FieldLabel>{t("yourRating")}</FieldLabel>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="rv_name">{t("name")}</FieldLabel>
          <Input id="rv_name" {...form.register("author_name")} />
          {form.formState.errors.author_name && (
            <FieldError>{t("nameError")}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="rv_email">{t("email")}</FieldLabel>
          <Input id="rv_email" type="email" {...form.register("author_email")} />
          {form.formState.errors.author_email && (
            <FieldError>{t("emailError")}</FieldError>
          )}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="rv_title">{t("reviewTitle")}</FieldLabel>
        <Input id="rv_title" {...form.register("title")} />
      </Field>

      <Field>
        <FieldLabel htmlFor="rv_body">{t("yourReview")}</FieldLabel>
        <Textarea id="rv_body" rows={4} {...form.register("body")} />
        {form.formState.errors.body && <FieldError>{t("bodyError")}</FieldError>}
      </Field>

      <Button type="submit" disabled={createReview.isPending}>
        {createReview.isPending ? <Spinner /> : t("submit")}
      </Button>
    </form>
  );
}
