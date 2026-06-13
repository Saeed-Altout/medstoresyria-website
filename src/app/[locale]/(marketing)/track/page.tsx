"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { OrderTracker } from "@/components/modules/order-tracker";
import { useTrackOrder } from "@/lib/hooks/commerce";

function TrackOrderInner() {
  const t = useTranslations("track");
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("order") ?? "",
  );
  const [email, setEmail] = useState("");
  const track = useTrackOrder();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber && email) {
      track.mutate({ orderNumber: orderNumber.trim(), email: email.trim() });
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
      <p className="mb-6 text-muted-foreground">{t("subtitle")}</p>

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="order">{t("orderNumber")}</FieldLabel>
            <Input
              id="order"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="ORD-..."
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Button type="submit" disabled={track.isPending} className="w-full">
            {track.isPending ? <Spinner /> : t("trackButton")}
          </Button>
        </form>
      </Card>

      {track.isError && (
        <p className="mt-4 text-center text-sm text-destructive">
          {t("notFound")}
        </p>
      )}

      {track.data && (
        <Card className="mt-6 p-6">
          <OrderTracker order={track.data} />
        </Card>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center"><Spinner /></div>}>
      <TrackOrderInner />
    </Suspense>
  );
}
