import apiClient from "./client";
import type { ApiResponse, Category } from "@/types";

type CategoriesPayload = Category[] | { data: Category[] };

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<ApiResponse<CategoriesPayload>>(
    "/categories",
    // Ask for a high limit so the storefront nav shows the full tree.
    { params: { limit: 100 } },
  );
  const payload = data.data;
  // Backend may return a bare array (old) or a paginated { data, meta } object.
  return Array.isArray(payload) ? payload : (payload?.data ?? []);
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const { data } = await apiClient.get<ApiResponse<Category>>(
    `/categories/${slug}`,
  );
  return data.data;
};
