import apiClient from "./client";
import type { ApiResponse, Category } from "@/types";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<ApiResponse<Category[]>>("/categories");
  return data.data;
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const { data } = await apiClient.get<ApiResponse<Category>>(
    `/categories/${slug}`,
  );
  return data.data;
};
