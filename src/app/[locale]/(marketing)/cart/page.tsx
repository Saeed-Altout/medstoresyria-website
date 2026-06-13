"use client";

import { useTranslations } from "next-intl";
import { IconShoppingCart, IconTrash } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { QuantityStepper } from "@/components/modules/quantity-stepper";
import {
  selectCartSubtotal,
  useCartStore,
} from "@/stores/cart.store";
import { formatPrice } from "@/lib/utils/format";

export default function CartPage() {
  const t = useTranslations("cart");
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const subtotal = useCartStore(selectCartSubtotal);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  if (hasHydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconShoppingCart />
            </EmptyMedia>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("emptyDesc")}</EmptyDescription>
          </EmptyHeader>
          <Button asChild>
            <Link href="/products">{t("continueShopping")}</Link>
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.productId} className="flex flex-row gap-4 p-4">
              <Link
                href={`/products/${item.slug}`}
                className="size-24 shrink-0 overflow-hidden rounded-md border bg-muted"
              >
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="size-full object-cover" />
                )}
              </Link>
              <div className="flex flex-1 flex-col gap-2">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-medium hover:underline"
                >
                  {item.name}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {formatPrice(item.price_usd)}
                </span>
                <div className="mt-auto flex items-center justify-between">
                  <QuantityStepper
                    value={item.quantity}
                    max={item.stock_qty}
                    onChange={(q) => updateQty(item.productId, q)}
                  />
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      {formatPrice(parseFloat(item.price_usd) * item.quantity)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.productId)}
                      aria-label={t("remove")}
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="h-fit p-6">
          <h2 className="mb-4 font-semibold">{t("summary")}</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("deliveryNote")}
          </p>
          <Separator className="my-4" />
          <Button asChild size="lg" className="w-full">
            <Link href="/checkout">{t("checkout")}</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
