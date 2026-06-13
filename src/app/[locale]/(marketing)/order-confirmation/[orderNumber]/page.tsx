"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const t = useTranslations("confirmation");

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Card className="flex flex-col items-center gap-4 p-10 text-center">
        <IconCircleCheckFilled className="size-16 text-green-600" />
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
        <div className="rounded-lg bg-muted px-6 py-3">
          <p className="text-sm text-muted-foreground">{t("orderNumber")}</p>
          <p className="text-xl font-semibold tracking-wide">{orderNumber}</p>
        </div>
        <p className="text-sm text-muted-foreground">{t("trackHint")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={`/track?order=${orderNumber}`}>{t("trackOrder")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">{t("continueShopping")}</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
