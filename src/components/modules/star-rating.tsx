"use client";

import { useState } from "react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  /** When provided, the component is interactive. */
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = { sm: "size-3.5", md: "size-5", lg: "size-7" } as const;

export function StarRating({
  value,
  onChange,
  size = "md",
  className,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const interactive = !!onChange;
  const shown = hover ?? value;
  const sizeClass = SIZES[size];

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(shown);
        const Star = filled ? IconStarFilled : IconStar;
        return interactive ? (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(i + 1)}
            aria-label={`${i + 1} stars`}
            className="transition-transform hover:scale-110"
          >
            <Star className={cn(sizeClass, filled ? "text-amber-500" : "text-muted-foreground/40")} />
          </button>
        ) : (
          <Star
            key={i}
            className={cn(sizeClass, filled ? "text-amber-500" : "text-muted-foreground/30")}
          />
        );
      })}
    </div>
  );
}
