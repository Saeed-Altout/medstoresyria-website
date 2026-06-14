"use client";

import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/modules/product-card";
import { useProducts } from "@/lib/hooks/catalog";
import { useDirection } from "@/hooks/use-direction";

interface RelatedProductsProps {
  categoryId?: string;
  brandId?: string;
  excludeId: string;
}

export function RelatedProducts({
  categoryId,
  brandId,
  excludeId,
}: RelatedProductsProps) {
  const t = useTranslations("product");
  const { dir } = useDirection();

  const filter = categoryId ? { categoryId } : brandId ? { brandId } : null;
  const { data } = useProducts({ ...(filter ?? {}), limit: 12 });

  if (!filter) return null;

  const products = (data?.data ?? []).filter((p) => p.id !== excludeId);
  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold">{t("relatedProducts")}</h2>
      <Carousel
        opts={{ align: "start", direction: dir, slidesToScroll: 2 }}
        className="w-full"
      >
        <CarouselContent className="-ms-4">
          {products.map((p) => (
            <CarouselItem
              key={p.id}
              className="ps-4 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <ProductCard product={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
