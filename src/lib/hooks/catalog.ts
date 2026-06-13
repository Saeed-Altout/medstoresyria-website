"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
} from "@/lib/api/products.api";
import { getCategories, getCategoryBySlug } from "@/lib/api/categories.api";
import { getBrands, getBrandBySlug } from "@/lib/api/brands.api";
import type {
  Brand,
  Category,
  PaginatedResponse,
  ProductDetail,
  ProductFilters,
  ProductListItem,
} from "@/types";

export const catalogKeys = {
  products: (filters: ProductFilters) =>
    ["products", "list", filters] as const,
  featured: ["products", "featured"] as const,
  product: (slug: string) => ["products", "detail", slug] as const,
  categories: ["categories"] as const,
  category: (slug: string) => ["categories", slug] as const,
  brands: ["brands"] as const,
  brand: (slug: string) => ["brands", slug] as const,
};

export function useProducts(filters: ProductFilters) {
  return useQuery<PaginatedResponse<ProductListItem>, AxiosError>({
    queryKey: catalogKeys.products(filters),
    queryFn: () => getProducts(filters),
    placeholderData: keepPreviousData,
  });
}

export function useFeaturedProducts() {
  return useQuery<ProductListItem[], AxiosError>({
    queryKey: catalogKeys.featured,
    queryFn: getFeaturedProducts,
  });
}

export function useProduct(slug: string) {
  return useQuery<ProductDetail, AxiosError>({
    queryKey: catalogKeys.product(slug),
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery<Category[], AxiosError>({
    queryKey: catalogKeys.categories,
    queryFn: getCategories,
    staleTime: 5 * 60_000,
  });
}

export function useCategory(slug: string) {
  return useQuery<Category, AxiosError>({
    queryKey: catalogKeys.category(slug),
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
  });
}

export function useBrands() {
  return useQuery<Brand[], AxiosError>({
    queryKey: catalogKeys.brands,
    queryFn: getBrands,
    staleTime: 5 * 60_000,
  });
}

export function useBrand(slug: string) {
  return useQuery<Brand, AxiosError>({
    queryKey: catalogKeys.brand(slug),
    queryFn: () => getBrandBySlug(slug),
    enabled: !!slug,
  });
}
