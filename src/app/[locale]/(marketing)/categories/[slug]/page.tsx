"use client";

import { use, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductGrid } from "@/components/modules/product-grid";
import { useCategory, useProducts } from "@/lib/hooks/catalog";
import type { ProductFilters } from "@/types";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("catalog");
  const { data: category, isLoading: loadingCat } = useCategory(slug);

  const [sort, setSort] = useState("createdAt:DESC");
  const [sortBy, sortOrder] = sort.split(":") as [
    ProductFilters["sortBy"],
    ProductFilters["sortOrder"],
  ];

  const { data: products, isLoading } = useProducts({
    categoryId: category?.id,
    sortBy,
    sortOrder,
    limit: 24,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        {loadingCat ? (
          <Skeleton className="h-9 w-64" />
        ) : (
          <>
            <h1 className="text-2xl font-bold">{category?.name}</h1>
            {category?.description && (
              <p className="mt-1 text-muted-foreground">
                {category.description}
              </p>
            )}
          </>
        )}
      </div>

      {/* Subcategories */}
      {category && category.children.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/categories/${child.slug}`}
              className="rounded-full border px-4 py-1.5 text-sm hover:border-primary hover:bg-accent"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-48" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt:DESC">{t("sort.newest")}</SelectItem>
            <SelectItem value="price:ASC">{t("sort.priceAsc")}</SelectItem>
            <SelectItem value="price:DESC">{t("sort.priceDesc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProductGrid
        products={products?.data}
        loading={isLoading || loadingCat}
      />
    </div>
  );
}
