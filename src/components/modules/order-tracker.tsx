"use client";

import { useTranslations } from "next-intl";
import { IconCircleCheck, IconCircleDot } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils/format";
import type { Order, OrderStatus } from "@/types";

const STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  confirmed: "default",
  preparing: "default",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
  rejected: "destructive",
};

export function OrderTracker({ order }: { order: Order }) {
  const t = useTranslations("order");
  const logs = [...order.status_logs].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{t("orderNumber")}</p>
          <p className="text-lg font-semibold">{order.order_number}</p>
        </div>
        <Badge variant={STATUS_VARIANT[order.status]} className="text-sm">
          {t(`status.${order.status}`)}
        </Badge>
      </div>

      {/* Timeline */}
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

      {/* Items + totals */}
      <div className="rounded-lg border">
        <ul className="divide-y">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-2 px-4 py-3 text-sm">
              <span>
                {item.product_name_snapshot} × {item.quantity}
              </span>
              <span className="font-medium">${item.total_usd}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span>${order.subtotal_usd}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("delivery")}</span>
            <span>${order.delivery_fee_usd}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-semibold">
            <span>{t("total")}</span>
            <span>${order.total_usd}</span>
          </div>
        </div>
      </div>

      {order.invoice && (
        <a
          href={order.invoice.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-primary hover:underline"
        >
          {t("downloadInvoice")} ({order.invoice.invoice_number})
        </a>
      )}
    </div>
  );
}
