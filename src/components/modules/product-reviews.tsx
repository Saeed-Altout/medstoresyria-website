"use client";

import { useTranslations } from "next-intl";
import { IconCircleCheck } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/modules/star-rating";
import { ReviewForm } from "@/components/modules/review-form";
import { useReviews, useReviewSummary } from "@/lib/hooks/reviews";
import { formatDate } from "@/lib/utils/format";

export function ProductReviews({ productId }: { productId: string }) {
  const t = useTranslations("reviews");
  const { data: summary, isLoading: loadingSummary } = useReviewSummary(productId);
  const { data: reviews, isLoading: loadingReviews } = useReviews(productId);

  const total = summary?.count ?? 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Summary */}
      <div className="space-y-4">
        {loadingSummary ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : (
          <div className="rounded-xl border p-5 text-center">
            <p className="text-4xl font-bold">{summary?.average?.toFixed(1) ?? "0.0"}</p>
            <StarRating value={summary?.average ?? 0} className="my-2 justify-center" />
            <p className="text-sm text-muted-foreground">
              {t("count", { count: total })}
            </p>

            {total > 0 && (
              <div className="mt-4 space-y-1.5">
                {([5, 4, 3, 2, 1] as const).map((star) => {
                  const c = summary?.breakdown[String(star) as "1"] ?? 0;
                  const pct = total ? (c / total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-muted-foreground">{star}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-amber-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-end text-muted-foreground">{c}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* List + form */}
      <div className="space-y-6">
        {loadingReviews ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : reviews && reviews.data.length > 0 ? (
          <ul className="space-y-5">
            {reviews.data.map((r) => (
              <li key={r.id} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <StarRating value={r.rating} size="sm" />
                  {r.title && <span className="font-medium">{r.title}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{r.body}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{r.author_name}</span>
                  <span>·</span>
                  <span>{formatDate(r.created_at)}</span>
                  {r.is_verified_purchase && (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <IconCircleCheck className="size-3.5" />
                      {t("verifiedPurchase")}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        )}

        <Separator />
        <ReviewForm productId={productId} />
      </div>
    </div>
  );
}
