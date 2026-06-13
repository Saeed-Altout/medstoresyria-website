"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { GoogleButton } from "@/components/modules/google-button";
import { useRegister } from "@/lib/hooks/auth";

const schema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const register = useRegister();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const submit = form.handleSubmit((values) => {
    register.mutate(
      { ...values, phone: values.phone || undefined },
      { onSuccess: () => router.push("/account") },
    );
  });

  const errors = form.formState.errors;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("registerTitle")}</CardTitle>
        <CardDescription>{t("registerSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleButton />
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">{t("or")}</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="first_name">{t("firstName")}</FieldLabel>
              <Input id="first_name" {...form.register("first_name")} />
              {errors.first_name && <FieldError>{t("errors.firstName")}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="last_name">{t("lastName")}</FieldLabel>
              <Input id="last_name" {...form.register("last_name")} />
              {errors.last_name && <FieldError>{t("errors.lastName")}</FieldError>}
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
            <Input id="email" type="email" {...form.register("email")} />
            {errors.email && <FieldError>{t("errors.email")}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">
              {t("phone")}{" "}
              <span className="text-muted-foreground">({t("optional")})</span>
            </FieldLabel>
            <Input id="phone" {...form.register("phone")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
            <Input id="password" type="password" {...form.register("password")} />
            {errors.password && <FieldError>{t("errors.passwordLen")}</FieldError>}
          </Field>
          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending ? <Spinner /> : t("createAccount")}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t("haveAccount")}{" "}
          <Link href="/login" className="text-primary hover:underline">
            {t("login")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
