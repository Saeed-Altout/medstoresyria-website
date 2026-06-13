"use client";

import { useTranslations } from "next-intl";
import { IconTool } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useMyMaintenance } from "@/lib/hooks/account";
import { formatDate } from "@/lib/utils/format";
import type { MaintenanceStatus } from "@/types";

const VARIANT: Record<MaintenanceStatus, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  assigned: "default",
  in_progress: "default",
  completed: "default",
  cancelled: "destructive",
};

export default function MyMaintenancePage() {
  const t = useTranslations("account");
  const tm = useTranslations("maintenance");
  const { data: requests, isLoading } = useMyMaintenance();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("maintenance")}</h1>
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("maintenance")}</h1>
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconTool />
            </EmptyMedia>
            <EmptyTitle>{t("noMaintenance")}</EmptyTitle>
            <EmptyDescription>{t("noMaintenanceDesc")}</EmptyDescription>
          </EmptyHeader>
          <Button asChild>
            <Link href="/maintenance">{tm("title")}</Link>
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("maintenance")}</h1>
      {requests.map((r) => (
        <Card key={r.id} className="flex flex-row items-center justify-between gap-4 p-5">
          <div>
            <p className="font-semibold">{r.request_number}</p>
            <p className="text-sm text-muted-foreground">
              {r.device_type} · {formatDate(r.created_at)}
            </p>
          </div>
          <Badge variant={VARIANT[r.status]}>{tm(`status.${r.status}`)}</Badge>
        </Card>
      ))}
    </div>
  );
}
