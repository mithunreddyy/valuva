import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  PaginatedResponse,
  Product,
  ProductFilters,
} from "@/types";

export const productsService = {
  getProducts: async (
    filters: ProductFilters
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      "/products",
      {
        params: filters,
      }
    );
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`
    );
    return response.data.data!;
  },

  getRelatedProducts: async (id: string): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/products/${id}/related`
    );
    return response.data.data!;
  },

  searchProducts: async (query: string, limit?: number): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      "/products/search",
      {
        params: { q: query, limit },
      }
    );
    return response.data.data!;
  },
};
