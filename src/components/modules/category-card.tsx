import { IconCategory } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

/** A category tile: logo/image on top, title below — like a storefront category chip. */
export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition-colors hover:border-primary hover:bg-accent",
        className,
      )}
    >
      <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10">
        {category.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.imageUrl}
            alt={category.name}
            className="size-full object-cover"
          />
        ) : (
          <IconCategory className="size-7" />
        )}
      </div>
      <span className="text-sm font-medium">{category.name}</span>
    </Link>
  );
}
