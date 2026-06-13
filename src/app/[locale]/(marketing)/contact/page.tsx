import { getTranslations } from "next-intl/server";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { getSettingsMap } from "@/lib/api/settings.api";
import { Card } from "@/components/ui/card";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  let settings: Record<string, string> = {};
  try {
    settings = await getSettingsMap();
  } catch {
    settings = {};
  }

  const items = [
    {
      icon: IconPhone,
      label: t("phone"),
      value: settings.SUPPORT_PHONE ?? settings.STORE_PHONE ?? "+963 11 000 0000",
    },
    {
      icon: IconMail,
      label: t("email"),
      value: settings.SUPPORT_EMAIL ?? "support@medstoresyria.com",
    },
    {
      icon: IconMapPin,
      label: t("address"),
      value: settings.STORE_ADDRESS ?? "Damascus, Syria",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.label} className="flex flex-col items-center gap-2 p-6 text-center">
            <item.icon className="size-7 text-primary" />
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="font-medium" dir="ltr">
              {item.value}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
