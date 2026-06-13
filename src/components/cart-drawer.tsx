"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconShoppingCart, IconTrash, IconX } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  selectCartCount,
  selectCartSubtotal,
  useCartStore,
} from "@/stores/cart.store";
import { useDirection } from "@/hooks/use-direction";
import { formatPrice } from "@/lib/utils/format";
import { QuantityStepper } from "@/components/modules/quantity-stepper";

export function CartDrawer() {
  const t = useTranslations("cart");
  const { sheetSide } = useDirection();
  const [open, setOpen] = useState(false);

  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={t("title")}>
          <IconShoppingCart className="size-5" />
          {count > 0 && (
            <Badge
              variant="default"
              className="absolute -end-1 -top-1 size-5 justify-center rounded-full p-0 text-[10px]"
            >
              {count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side={sheetSide} className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <IconShoppingCart className="size-12 opacity-40" />
            <p>{t("empty")}</p>
            <Button variant="outline" asChild onClick={() => setOpen(false)}>
              <Link href="/products">{t("continueShopping")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3 py-3">
                    <div className="size-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm font-medium hover:underline"
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground"
                          onClick={() => removeItem(item.productId)}
                          aria-label={t("remove")}
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="gap-3">
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="text-base font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Button asChild size="lg" onClick={() => setOpen(false)}>
                <Link href="/checkout">{t("checkout")}</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href="/cart">
                  <IconX className="size-4" />
                  {t("viewCart")}
                </Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
