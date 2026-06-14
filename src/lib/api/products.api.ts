import apiClient from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  ProductDetail,
  ProductFilters,
  ProductListItem,
} from "@/types";

export const getProducts = async (
  filters: ProductFilters = {},
): Promise<PaginatedResponse<ProductListItem>> => {
  const { data } = await apiClient.get<ApiResponse<ProductListItem[]>>(
    "/products",
    { params: filters },
  );
  return { data: data.data, meta: data.meta! };
};

export const getFeaturedProducts = async (): Promise<ProductListItem[]> => {
  const { data } = await apiClient.get<ApiResponse<ProductListItem[]>>(
    "/products/featured",
  );
  return data.data;
};

export const getProductBySlug = async (
  slug: string,
): Promise<ProductDetail> => {
  const { data } = await apiClient.get<
    ApiResponse<ProductDetail & { attributeValues?: ProductDetail["attributes"] }>
  >(`/products/${slug}`);
  const raw = data.data;
  // Backend serializes specs as `attributeValues`; the app uses `attributes`.
  return {
    ...raw,
    attributes: raw.attributes ?? raw.attributeValues ?? [],
  };
};
