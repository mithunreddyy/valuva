import apiClient from "@/lib/axios";
import { Product } from "@/types";

interface ProductsResponse {
  success: boolean;
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const productsApi = {
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    subCategoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    search?: string;
    sort?: "price_asc" | "price_desc" | "newest" | "popular";
    isFeatured?: boolean;
    isNewArrival?: boolean;
  }): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>("/products", {
      params,
    });
    return response.data;
  },

  getProductById: async (
    id: string
  ): Promise<{ success: boolean; data: Product }> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getRelatedProducts: async (
    id: string
  ): Promise<{ success: boolean; data: Product[] }> => {
    const response = await apiClient.get(`/products/${id}/related`);
    return response.data;
  },

  searchProducts: async (
    query: string,
    limit?: number
  ): Promise<{ success: boolean; data: Product[] }> => {
    const response = await apiClient.get("/products/search", {
      params: { q: query, limit },
    });
    return response.data;
  },
};
