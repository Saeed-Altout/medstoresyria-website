import { ProductCard } from "@/components/modules/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ProductListItem } from "@/types";

interface ProductGridProps {
  products?: ProductListItem[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
}

export function ProductGrid({
  products,
  loading,
  skeletonCount = 8,
  className,
}: ProductGridProps) {
  const base = cn(
    "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
    className,
  );

  if (loading) {
    return (
      <div className={base}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={base}>
      {products?.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
