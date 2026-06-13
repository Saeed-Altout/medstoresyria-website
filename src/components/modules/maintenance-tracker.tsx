"use client";

import { useTranslations } from "next-intl";
import { IconCircleCheck, IconCircleDot } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils/format";
import type { MaintenanceRequest, MaintenanceStatus } from "@/types";

const VARIANT: Record<MaintenanceStatus, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  assigned: "default",
  in_progress: "default",
  completed: "default",
  cancelled: "destructive",
};

export function MaintenanceTracker({
  request,
}: {
  request: MaintenanceRequest;
}) {
  const t = useTranslations("maintenance");
  const logs = [...request.status_logs].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{t("requestNumber")}</p>
          <p className="text-lg font-semibold">{request.request_number}</p>
        </div>
        <Badge variant={VARIANT[request.status]} className="text-sm">
          {t(`status.${request.status}`)}
        </Badge>
      </div>

      <dl className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">{t("deviceType")}</dt>
          <dd className="font-medium">{request.device_type}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("visitType")}</dt>
          <dd className="font-medium">{t(`visit.${request.visit_type}`)}</dd>
        </div>
        {request.technician && (
          <div>
            <dt className="text-muted-foreground">{t("technician")}</dt>
            <dd className="font-medium">
              {request.technician.first_name} {request.technician.last_name}
            </dd>
          </div>
        )}
        {request.scheduled_at && (
          <div>
            <dt className="text-muted-foreground">{t("scheduledAt")}</dt>
            <dd className="font-medium">{formatDateTime(request.scheduled_at)}</dd>
          </div>
        )}
      </dl>

      <ol className="relative space-y-4 border-s ps-6">
        {logs.map((log, i) => {
          const isLast = i === logs.length - 1;
          return (
            <li key={log.id} className="relative">
              <span className="absolute -start-[31px] top-0.5 bg-background">
                {isLast ? (
                  <IconCircleDot className="size-5 text-primary" />
                ) : (
                  <IconCircleCheck className="size-5 text-muted-foreground" />
                )}
              </span>
              <p className={cn("font-medium", isLast && "text-primary")}>
                {t(`status.${log.status}`)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(log.created_at)}
              </p>
              {log.note && (
                <p className="mt-1 text-sm text-muted-foreground">{log.note}</p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
