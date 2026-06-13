"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderTracker } from "@/components/modules/order-tracker";
import { useMyOrders } from "@/lib/hooks/account";
import { useDirection } from "@/hooks/use-direction";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("order");
  const { iconClass } = useDirection();
  const { data: orders, isLoading } = useMyOrders();
  const order = orders?.find((o) => o.id === id);

  return (
    <div className="space-y-6">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <IconArrowLeft className={`size-4 ${iconClass}`} />
        {t("backToOrders")}
      </Link>

      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : order ? (
        <Card className="p-6">
          <OrderTracker order={order} />
        </Card>
      ) : (
        <p className="text-muted-foreground">{t("notFound")}</p>
      )}
    </div>
  );
}
