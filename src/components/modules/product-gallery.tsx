"use client";

import { useCallback, useEffect, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPhoto,
  IconX,
  IconZoomIn,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

export function ProductGallery({
  images,
  alt,
}: {
  images: ProductImage[];
  alt: string;
}) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const count = sorted.length;
  const current = sorted[active];

  const next = useCallback(
    () => setActive((i) => (i + 1) % count),
    [count],
  );
  const prev = useCallback(
    () => setActive((i) => (i - 1 + count) % count),
    [count],
  );

  // Keyboard navigation while the lightbox is open.
  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen, next, prev]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => current && setZoomOpen(true)}
        className="group relative block aspect-square w-full overflow-hidden rounded-xl border bg-muted"
        aria-label={alt}
      >
        {current ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={alt}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute end-3 top-3 rounded-full bg-background/80 p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              <IconZoomIn className="size-4" />
            </span>
          </>
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <IconPhoto className="size-16" />
          </div>
        )}
      </button>

      {count > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "aspect-square overflow-hidden rounded-lg border bg-muted",
                i === active && "ring-2 ring-primary",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox: blurred backdrop only, image floats with no card background */}
      {zoomOpen && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in-0"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            aria-label="Close"
            className="absolute end-4 top-4 rounded-full bg-background/70 p-2 text-foreground transition hover:bg-background"
          >
            <IconX className="size-5" />
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute start-4 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2.5 text-foreground transition hover:bg-background"
              >
                <IconChevronLeft className="size-6 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute end-4 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2.5 text-foreground transition hover:bg-background"
              >
                <IconChevronRight className="size-6 rtl:rotate-180" />
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] object-contain drop-shadow-2xl"
          />

          {count > 1 && (
            <div
              className="absolute bottom-5 start-1/2 flex -translate-x-1/2 gap-2 rtl:translate-x-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              {sorted.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Image ${i + 1}`}
                  className={cn(
                    "size-2.5 rounded-full transition",
                    i === active ? "bg-white" : "bg-white/40 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
