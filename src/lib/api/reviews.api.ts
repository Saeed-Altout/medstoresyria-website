import apiClient from "./client";
import type {
  ApiResponse,
  CreateReviewDto,
  PaginatedResponse,
  Review,
  ReviewSummary,
} from "@/types";

export const getReviews = async (
  productId: string,
  page = 1,
  limit = 10,
): Promise<PaginatedResponse<Review>> => {
  const { data } = await apiClient.get<ApiResponse<Review[]>>("/reviews", {
    params: { productId, page, limit },
  });
  return { data: data.data, meta: data.meta! };
};

export const getReviewSummary = async (
  productId: string,
): Promise<ReviewSummary> => {
  const { data } = await apiClient.get<ApiResponse<ReviewSummary>>(
    `/reviews/summary/${productId}`,
  );
  return data.data;
};

export const createReview = async (
  dto: CreateReviewDto,
): Promise<{ data: { id: string }; message: string }> => {
  const { data } = await apiClient.post<ApiResponse<{ id: string }>>(
    "/reviews",
    dto,
  );
  return { data: data.data, message: data.message };
};
