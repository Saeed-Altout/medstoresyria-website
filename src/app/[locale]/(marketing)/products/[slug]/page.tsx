"use client";

import { use, useState } from "react";
import { useTranslations } from "next-intl";
import {
  IconCheck,
  IconCircleCheck,
  IconLink,
  IconShare,
  IconShieldCheck,
  IconTool,
  IconTruck,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGallery } from "@/components/modules/product-gallery";
import { AddToCart } from "@/components/modules/add-to-cart";
import { StarRating } from "@/components/modules/star-rating";
import { ProductReviews } from "@/components/modules/product-reviews";
import { RelatedProducts } from "@/components/modules/related-products";
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
  const [tab, setTab] = useState("description");

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
  const lowStock = inStock && product.stock_qty <= (product.stock_min || 0);
  const ratingCount = product.rating_count ?? 0;
  const ratingAvg = product.rating_average ?? 0;
  const attributes = product.attributes ?? [];

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(t("linkCopied"));
    }
  };

  const perks = [
    { icon: IconTruck, label: t("delivery.nationwide") },
    { icon: IconShieldCheck, label: t("delivery.genuine") },
    { icon: IconTool, label: t("delivery.maintenance") },
  ];

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
            <BreadcrumbPage className="line-clamp-1">{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images ?? []} alt={product.name} />

        {/* Buy box */}
        <div className="lg:sticky lg:top-20 lg:self-start">
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

              <button
                type="button"
                onClick={() => setTab("reviews")}
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <StarRating value={ratingAvg} size="sm" />
                <span className="text-muted-foreground">
                  {ratingCount > 0
                    ? `${ratingAvg.toFixed(1)} (${ratingCount})`
                    : t("noReviewsYet")}
                </span>
              </button>

              <div className="flex items-center gap-2 pt-1">
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

            {lowStock && (
              <p className="text-sm font-medium text-amber-600">
                {t("onlyLeft", { count: product.stock_qty })}
              </p>
            )}

            <AddToCart product={product} />

            <Button variant="outline" size="sm" onClick={onShare}>
              {typeof navigator !== "undefined" && "share" in navigator ? (
                <IconShare className="size-4" />
              ) : (
                <IconLink className="size-4" />
              )}
              {t("share")}
            </Button>

            <Separator />

            {/* Trust / delivery */}
            <ul className="space-y-2">
              {perks.map((p) => (
                <li key={p.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <p.icon className="size-4 text-primary" />
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="description">{t("tabs.description")}</TabsTrigger>
            <TabsTrigger value="specifications">
              {t("tabs.specifications")}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              {t("tabs.reviews")}
              {ratingCount > 0 && ` (${ratingCount})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-6">
            {product.description ? (
              <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noDescription")}</p>
            )}

            {product.condition === "used" && product.condition_report && (
              <div className="mt-6 max-w-3xl space-y-2">
                <h3 className="flex items-center gap-2 font-semibold">
                  <IconCircleCheck className="size-4 text-primary" />
                  {t("conditionReport")}
                </h3>
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {product.condition_report}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="specifications" className="pt-6">
            {attributes.length > 0 ? (
              <dl className="max-w-2xl divide-y rounded-lg border">
                {attributes.map((attr) => (
                  <div
                    key={attr.key}
                    className="flex justify-between gap-4 px-4 py-2.5 text-sm odd:bg-muted/30"
                  >
                    <dt className="text-muted-foreground">{attr.label}</dt>
                    <dd className="font-medium">{attr.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noSpecifications")}</p>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            <ProductReviews productId={product.id} />
          </TabsContent>
        </Tabs>
      </div>

      <RelatedProducts
        categoryId={product.category?.id}
        brandId={product.brand?.id}
        excludeId={product.id}
      />
    </div>
  );
}
