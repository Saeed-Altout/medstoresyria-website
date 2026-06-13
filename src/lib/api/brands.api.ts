import apiClient from "./client";
import type { ApiResponse, Brand } from "@/types";

export const getBrands = async (): Promise<Brand[]> => {
  const { data } = await apiClient.get<ApiResponse<Brand[]>>("/brands");
  return data.data;
};

export const getBrandBySlug = async (slug: string): Promise<Brand> => {
  const { data } = await apiClient.get<ApiResponse<Brand>>(`/brands/${slug}`);
  return data.data;
};
