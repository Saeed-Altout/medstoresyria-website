"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands } from "@/lib/hooks/catalog";

export default function BrandsPage() {
  const t = useTranslations("brands");
  const { data: brands, isLoading } = useBrands();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {brands?.map((b) => (
            <Link key={b.id} href={`/brands/${b.slug}`}>
              <Card className="flex h-32 flex-col items-center justify-center gap-3 p-4 transition-colors hover:border-primary">
                {b.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.logoUrl} alt={b.name} className="max-h-12 max-w-[70%]" />
                ) : (
                  <span className="text-lg font-semibold">{b.name}</span>
                )}
                <span className="text-sm text-muted-foreground">{b.name}</span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
