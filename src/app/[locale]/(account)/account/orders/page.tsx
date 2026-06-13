"use client";

import { useTranslations } from "next-intl";
import { IconPackage } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { useMyOrders } from "@/lib/hooks/account";
import { formatDate } from "@/lib/utils/format";
import type { OrderStatus } from "@/types";

const STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  confirmed: "default",
  preparing: "default",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
  rejected: "destructive",
};

export default function MyOrdersPage() {
  const t = useTranslations("account");
  const tOrder = useTranslations("order");
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("orders")}</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("orders")}</h1>
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconPackage />
            </EmptyMedia>
            <EmptyTitle>{t("noOrders")}</EmptyTitle>
            <EmptyDescription>{t("noOrdersDesc")}</EmptyDescription>
          </EmptyHeader>
          <Button asChild>
            <Link href="/products">{t("startShopping")}</Link>
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("orders")}</h1>
      {orders.map((order) => (
        <Link key={order.id} href={`/account/orders/${order.id}`}>
          <Card className="flex flex-row items-center justify-between gap-4 p-5 transition-colors hover:border-primary">
            <div>
              <p className="font-semibold">{order.order_number}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.created_at)} · {order.items.length}{" "}
                {t("items")}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={STATUS_VARIANT[order.status]}>
                {tOrder(`status.${order.status}`)}
              </Badge>
              <span className="font-semibold">${order.total_usd}</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
