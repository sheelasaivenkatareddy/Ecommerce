import "server-only";
import { cache } from "react";
import { ApiError, apiFetch } from "./api";
import type { Category, Product, ProductList, ProductSort } from "./types";

export interface ProductQuery {
  q?: string;
  category?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
  featured?: boolean;
}

export function getProducts(query: ProductQuery = {}): Promise<ProductList> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const search = params.toString();
  return apiFetch<ProductList>(`/api/products${search ? `?${search}` : ""}`);
}

/** A single product, or null if it does not exist. Cached so metadata and page share one request. */
export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  try {
    const { product } = await apiFetch<{ product: Product }>(`/api/products/${encodeURIComponent(slug)}`);
    return product;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const { categories } = await apiFetch<{ categories: Category[] }>("/api/categories");
  return categories;
});
