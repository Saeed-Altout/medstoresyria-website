import { useTranslations } from "next-intl";
import { IconHeartHandshake } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");

  const columns: { title: string; links: { label: string; href: string }[] }[] =
    [
      {
        title: t("shop"),
        links: [
          { label: t("allProducts"), href: "/products" },
          { label: t("brands"), href: "/brands" },
          { label: t("maintenance"), href: "/maintenance" },
          { label: t("trackOrder"), href: "/track" },
        ],
      },
      {
        title: t("company"),
        links: [
          { label: t("about"), href: "/about" },
          { label: t("contact"), href: "/contact" },
        ],
      },
      {
        title: t("account"),
        links: [
          { label: t("login"), href: "/login" },
          { label: t("register"), href: "/register" },
          { label: t("myOrders"), href: "/account/orders" },
        ],
      },
    ];

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <IconHeartHandshake className="size-6 text-primary" />
            MedStore Syria
          </Link>
          <p className="text-sm text-muted-foreground">{t("tagline")}</p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-semibold">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t py-4">
        <p className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MedStore Syria. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
