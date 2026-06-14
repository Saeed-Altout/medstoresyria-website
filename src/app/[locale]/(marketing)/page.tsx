"use client";

import { useTranslations } from "next-intl";
import {
  IconArrowRight,
  IconShieldCheck,
  IconTool,
  IconTruck,
} from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductGrid } from "@/components/modules/product-grid";
import { CategoryCard } from "@/components/modules/category-card";
import { useBrands, useCategories, useFeaturedProducts } from "@/lib/hooks/catalog";
import { useDirection } from "@/hooks/use-direction";

export default function HomePage() {
  const t = useTranslations("home");
  const { iconClass } = useDirection();
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const perks = [
    { icon: IconTruck, title: t("perks.delivery.title"), desc: t("perks.delivery.desc") },
    { icon: IconShieldCheck, title: t("perks.genuine.title"), desc: t("perks.genuine.desc") },
    { icon: IconTool, title: t("perks.maintenance.title"), desc: t("perks.maintenance.desc") },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-muted-foreground">{t("hero.subtitle")}</p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/products">
                  {t("hero.shopNow")}
                  <IconArrowRight className={`size-4 ${iconClass}`} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/maintenance">{t("hero.requestMaintenance")}</Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="aspect-[4/3] rounded-2xl bg-primary/10" />
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {perks.map((p) => (
            <Card key={p.title} className="flex flex-row items-start gap-4 p-5">
              <p.icon className="size-8 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">{t("categories")}</h2>
            <Link href="/products" className="text-sm text-primary hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">{t("featured")}</h2>
          <Link href="/products" className="text-sm text-primary hover:underline">
            {t("viewAll")}
          </Link>
        </div>
        <ProductGrid products={featured} loading={loadingFeatured} />
      </section>

      {/* Brands */}
      {brands && brands.length > 0 && (
        <section className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold">{t("brands")}</h2>
          <div className="flex flex-wrap items-center gap-6">
            {brands.slice(0, 12).map((b) => (
              <Link
                key={b.id}
                href={`/brands/${b.slug}`}
                className="flex h-16 items-center gap-2 rounded-lg border px-5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {b.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.logoUrl} alt={b.name} className="max-h-8" />
                ) : (
                  b.name
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Maintenance CTA */}
      <section className="mx-auto max-w-7xl px-4">
        <Card className="flex flex-col items-center gap-4 bg-primary/5 p-10 text-center">
          <IconTool className="size-10 text-primary" />
          <h2 className="text-2xl font-bold">{t("maintenanceCta.title")}</h2>
          <p className="max-w-xl text-muted-foreground">
            {t("maintenanceCta.desc")}
          </p>
          <Button size="lg" asChild>
            <Link href="/maintenance">{t("maintenanceCta.button")}</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
