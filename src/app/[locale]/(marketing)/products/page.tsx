"use client";

import { Suspense, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { IconFilter } from "@tabler/icons-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { ProductGrid } from "@/components/modules/product-grid";
import { ProductFiltersPanel } from "@/components/modules/product-filters";
import { useProducts } from "@/lib/hooks/catalog";
import { useDirection } from "@/hooks/use-direction";
import type { ProductFilters } from "@/types";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsCatalog />
    </Suspense>
  );
}

function ProductsCatalog() {
  const t = useTranslations("catalog");
  const router = useRouter();
  const { sheetSide } = useDirection();
  const searchParams = useSearchParams();

  const filters = useMemo<ProductFilters>(() => {
    const get = (k: string) => searchParams.get(k) ?? undefined;
    return {
      search: get("search"),
      categoryId: get("categoryId"),
      brandId: get("brandId"),
      condition: get("condition") as ProductFilters["condition"],
      priceMin: get("priceMin") ? Number(get("priceMin")) : undefined,
      priceMax: get("priceMax") ? Number(get("priceMax")) : undefined,
      sortBy: (get("sortBy") as ProductFilters["sortBy"]) ?? "createdAt",
      sortOrder: (get("sortOrder") as ProductFilters["sortOrder"]) ?? "DESC",
      page: get("page") ? Number(get("page")) : 1,
      limit: PAGE_SIZE,
    };
  }, [searchParams]);

  const { data, isLoading, isFetching } = useProducts(filters);

  const updateUrl = (patch: Partial<ProductFilters>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === "" || v === null) next.delete(k);
      else next.set(k, String(v));
    });
    router.push(`/products?${next.toString()}`);
  };

  const reset = () => router.push("/products");

  const setSort = (value: string) => {
    const [sortBy, sortOrder] = value.split(":") as [
      ProductFilters["sortBy"],
      ProductFilters["sortOrder"],
    ];
    updateUrl({ sortBy, sortOrder, page: 1 });
  };

  const totalPages = data?.meta.totalPages ?? 1;
  const currentPage = filters.page ?? 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        {filters.search ? t("resultsFor", { query: filters.search }) : t("title")}
      </h1>

      <div className="flex gap-8">
        {/* Desktop filters */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <ProductFiltersPanel
            filters={filters}
            onChange={updateUrl}
            onReset={reset}
          />
        </aside>

        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <IconFilter className="size-4" />
                  {t("filters")}
                </Button>
              </SheetTrigger>
              <SheetContent side={sheetSide} className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{t("filters")}</SheetTitle>
                </SheetHeader>
                <div className="px-4">
                  <ProductFiltersPanel
                    filters={filters}
                    onChange={updateUrl}
                    onReset={reset}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <span className="hidden text-sm text-muted-foreground sm:inline">
              {data ? t("count", { total: data.meta.total }) : ""}
            </span>

            <Select
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onValueChange={setSort}
            >
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

          {!isLoading && data && data.data.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
                <EmptyDescription>{t("emptyDesc")}</EmptyDescription>
              </EmptyHeader>
              <Button variant="outline" onClick={reset}>
                {t("reset")}
              </Button>
            </Empty>
          ) : (
            <ProductGrid
              products={data?.data}
              loading={isLoading || (isFetching && !data)}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          updateUrl({ page });
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
