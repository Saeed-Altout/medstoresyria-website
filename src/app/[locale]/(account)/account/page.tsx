"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe, useLogout } from "@/lib/hooks/auth";
import { useAuthStore } from "@/stores/auth.store";

export default function AccountPage() {
  const t = useTranslations("account");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { isLoading } = useMe();
  const logout = useLogout();

  const rows = [
    { label: t("name"), value: user ? `${user.first_name} ${user.last_name}` : "" },
    { label: t("email"), value: user?.email },
    { label: t("phone"), value: user?.phone ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("profile")}</h1>

      <Card className="p-6">
        <dl className="divide-y">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4 py-3 text-sm">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-medium">
                {isLoading ? <Skeleton className="h-4 w-32" /> : row.value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <Button
        variant="outline"
        onClick={() =>
          logout.mutate(undefined, { onSettled: () => router.push("/") })
        }
      >
        {t("logout")}
      </Button>
    </div>
  );
}
