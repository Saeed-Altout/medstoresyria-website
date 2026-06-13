"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductGallery } from "@/components/modules/product-gallery";
import { AddToCart } from "@/components/modules/add-to-cart";
import { useProduct } from "@/lib/hooks/catalog";
import { formatPrice } from "@/lib/utils/format";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("product");
  const { data: product, isLoading, isError } = useProduct(slug);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-2">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">{t("notFound")}</h1>
        <Link href="/products" className="mt-4 inline-block text-primary hover:underline">
          {t("backToProducts")}
        </Link>
      </div>
    );
  }

  const inStock = product.stock_qty > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">{t("home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/products">{t("products")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {product.category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/categories/${product.category.slug}`}>
                    {product.category.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="space-y-5">
          <div className="space-y-2">
            {product.brand && (
              <Link
                href={`/brands/${product.brand.slug}`}
                className="text-sm text-muted-foreground hover:underline"
              >
                {product.brand.name}
              </Link>
            )}
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={product.condition === "new" ? "default" : "secondary"}>
                {t(`condition.${product.condition}`)}
              </Badge>
              {inStock ? (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <IconCheck className="size-4" />
                  {t("inStock")}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm text-destructive">
                  <IconX className="size-4" />
                  {t("outOfStock")}
                </span>
              )}
            </div>
          </div>

          <p className="text-3xl font-bold text-primary">
            {formatPrice(product.price_usd)}
          </p>

          <AddToCart product={product} />

          <Separator />

          {product.description && (
            <div className="space-y-2">
              <h2 className="font-semibold">{t("description")}</h2>
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {product.condition === "used" && product.condition_report && (
            <div className="space-y-2">
              <h2 className="font-semibold">{t("conditionReport")}</h2>
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {product.condition_report}
              </p>
            </div>
          )}

          {product.attributes.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-semibold">{t("specifications")}</h2>
              <dl className="divide-y rounded-lg border">
                {product.attributes.map((attr) => (
                  <div
                    key={attr.key}
                    className="flex justify-between gap-4 px-4 py-2.5 text-sm"
                  >
                    <dt className="text-muted-foreground">{attr.label}</dt>
                    <dd className="font-medium">{attr.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
