"use client";

import { useTranslations } from "next-intl";
import { IconPhoto, IconShoppingCartPlus } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCartStore } from "@/stores/cart.store";
import { formatPrice } from "@/lib/utils/format";
import type { ProductListItem } from "@/types";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ProductListItem }) {
  const t = useTranslations("product");
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock_qty <= 0;

  const onAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price_usd: product.price_usd,
      image: product.primaryImageUrl,
      stock_qty: product.stock_qty,
    });
    toast.success(t("addedToCart"));
  };

  return (
    <Card className="group flex flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        {product.primaryImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.primaryImageUrl}
            alt={product.name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <IconPhoto className="size-10" />
          </div>
        )}
        <Badge
          variant={product.condition === "new" ? "default" : "secondary"}
          className="absolute start-2 top-2"
        >
          {t(`condition.${product.condition}`)}
        </Badge>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Badge variant="destructive">{t("outOfStock")}</Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand && (
          <span className="text-xs text-muted-foreground">
            {product.brand.name}
          </span>
        )}
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-medium hover:underline"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-semibold">
            {formatPrice(product.price_usd)}
          </span>
          <Button
            size="icon"
            variant="secondary"
            onClick={onAdd}
            disabled={outOfStock}
            aria-label={t("addToCart")}
          >
            <IconShoppingCartPlus className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
