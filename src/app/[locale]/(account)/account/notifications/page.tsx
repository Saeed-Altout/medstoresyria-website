"use client";

import { useTranslations } from "next-intl";
import { IconBell } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils/format";
import { useMarkAllRead, useMarkRead, useNotifications } from "@/lib/hooks/account";

export default function NotificationsPage() {
  const t = useTranslations("account");
  const { data, isLoading } = useNotifications();
  const markAll = useMarkAllRead();
  const markOne = useMarkRead();

  const notifications = data?.data ?? [];
  const hasUnread = notifications.some((n) => !n.is_read);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("notifications")}</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("notifications")}</h1>
        {hasUnread && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
          >
            {t("markAllRead")}
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconBell />
            </EmptyMedia>
            <EmptyTitle>{t("noNotifications")}</EmptyTitle>
            <EmptyDescription>{t("noNotificationsDesc")}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn(
                "cursor-pointer p-4 transition-colors hover:bg-accent",
                !n.is_read && "border-primary/40 bg-primary/5",
              )}
              onClick={() => !n.is_read && markOne.mutate(n.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                </div>
                {!n.is_read && (
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDateTime(n.created_at)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
