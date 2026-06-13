"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  IconBell,
  IconPackage,
  IconTool,
  IconUser,
} from "@tabler/icons-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("account");
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [hasHydrated, user, router, pathname]);

  const nav = [
    { href: "/account", label: t("profile"), icon: IconUser },
    { href: "/account/orders", label: t("orders"), icon: IconPackage },
    { href: "/account/maintenance", label: t("maintenance"), icon: IconTool },
    { href: "/account/notifications", label: t("notifications"), icon: IconBell },
  ];

  if (!hasHydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="space-y-1">
            {nav.map((item) => {
              const active =
                item.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
