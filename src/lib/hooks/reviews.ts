"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import {
  createReview,
  getReviews,
  getReviewSummary,
} from "@/lib/api/reviews.api";
import type {
  ApiResponse,
  CreateReviewDto,
  PaginatedResponse,
  Review,
  ReviewSummary,
} from "@/types";

export const reviewKeys = {
  list: (productId: string, page: number) =>
    ["reviews", productId, page] as const,
  summary: (productId: string) => ["reviews", "summary", productId] as const,
};

export function useReviews(productId: string, page = 1) {
  return useQuery<PaginatedResponse<Review>, AxiosError>({
    queryKey: reviewKeys.list(productId, page),
    queryFn: () => getReviews(productId, page),
    enabled: !!productId,
  });
}

export function useReviewSummary(productId: string) {
  return useQuery<ReviewSummary, AxiosError>({
    queryKey: reviewKeys.summary(productId),
    queryFn: () => getReviewSummary(productId),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation<
    { data: { id: string }; message: string },
    AxiosError,
    CreateReviewDto
  >({
    mutationFn: createReview,
    onSuccess: ({ message }, vars) => {
      toast.success(message);
      qc.invalidateQueries({ queryKey: ["reviews", vars.productId] });
    },
    onError: (err) =>
      toast.error(
        (err.response?.data as ApiResponse<null> | undefined)?.message ??
          "Something went wrong",
      ),
  });
}
