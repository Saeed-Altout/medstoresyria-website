import { getTranslations } from "next-intl/server";
import { IconShieldCheck, IconTool, IconTruck } from "@tabler/icons-react";

export default async function AboutPage() {
  const t = await getTranslations("about");

  const values = [
    { icon: IconShieldCheck, title: t("values.quality.title"), desc: t("values.quality.desc") },
    { icon: IconTruck, title: t("values.reach.title"), desc: t("values.reach.desc") },
    { icon: IconTool, title: t("values.support.title"), desc: t("values.support.desc") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t("intro")}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="space-y-2">
            <v.icon className="size-8 text-primary" />
            <h2 className="font-semibold">{v.title}</h2>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-4 text-muted-foreground">
        <p>{t("body1")}</p>
        <p>{t("body2")}</p>
      </div>
    </div>
  );
}
