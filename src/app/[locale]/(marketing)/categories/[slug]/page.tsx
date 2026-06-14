"use client";

import { use, useState } from "react";
import { useTranslations } from "next-intl";
import { IconCategory } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  const tNav = useTranslations("product");
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
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">{tNav("home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/products">{tNav("products")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">
              {category?.name ?? slug}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
      {category && (category.children?.length ?? 0) > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {category.children?.map((child) => (
            <Link
              key={child.id}
              href={`/categories/${child.slug}`}
              className="flex items-center gap-2 rounded-full border py-1.5 pe-4 ps-1.5 text-sm hover:border-primary hover:bg-accent"
            >
              <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground">
                {child.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={child.imageUrl} alt="" className="size-full object-cover" />
                ) : (
                  <IconCategory className="size-4" />
                )}
              </span>
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
