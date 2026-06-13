"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { IconExternalLink } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGrid } from "@/components/modules/product-grid";
import { useBrand, useProducts } from "@/lib/hooks/catalog";

export default function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("brands");
  const { data: brand, isLoading: loadingBrand } = useBrand(slug);
  const { data: products, isLoading } = useProducts({
    brandId: brand?.id,
    limit: 24,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        {loadingBrand ? (
          <Skeleton className="h-16 w-48" />
        ) : (
          <>
            {brand?.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logoUrl} alt={brand.name} className="max-h-16" />
            )}
            <div>
              <h1 className="text-2xl font-bold">{brand?.name}</h1>
              {brand?.description && (
                <p className="text-muted-foreground">{brand.description}</p>
              )}
              {brand?.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {t("visitWebsite")}
                  <IconExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          </>
        )}
      </div>

      <ProductGrid
        products={products?.data}
        loading={isLoading || loadingBrand}
      />
    </div>
  );
}
