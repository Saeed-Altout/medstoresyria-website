"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/modules/quantity-stepper";
import { useCartStore } from "@/stores/cart.store";
import type { ProductDetail } from "@/types";

export function AddToCart({ product }: { product: ProductDetail }) {
  const t = useTranslations("product");
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const outOfStock = product.stock_qty <= 0;

  const onAdd = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price_usd: product.price_usd,
        image: product.primaryImageUrl ?? product.images[0]?.url ?? null,
        stock_qty: product.stock_qty,
      },
      qty,
    );
    toast.success(t("addedToCart"));
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuantityStepper
        value={qty}
        max={product.stock_qty}
        onChange={setQty}
      />
      <Button size="lg" onClick={onAdd} disabled={outOfStock} className="flex-1">
        <IconShoppingCartPlus className="size-5" />
        {outOfStock ? t("outOfStock") : t("addToCart")}
      </Button>
    </div>
  );
}
