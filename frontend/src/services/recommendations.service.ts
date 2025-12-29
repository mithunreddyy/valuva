import { apiClient } from "@/lib/api-client";
import { ApiResponse, Product, ProductRecommendation } from "@/types";

/**
 * Recommendations Service
 * Handles product recommendations and personalization
 */
export const recommendationsService = {
  /**
   * Get recently viewed products
   * @param limit - Maximum number of products (default: 10)
   * @returns Array of recently viewed products
   */
  getRecentlyViewed: async (limit: number = 10): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      "/recommendations/recently-viewed",
      {
        params: { limit },
      }
    );
    return response.data.data!;
  },

  /**
   * Get similar products
   * @param productId - Product ID
   * @param limit - Maximum number of products (default: 8)
   * @returns Array of similar products
   */
  getSimilarProducts: async (
    productId: string,
    limit: number = 8
  ): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/recommendations/similar/${productId}`,
      {
        params: { limit },
      }
    );
    return response.data.data!;
  },

  /**
   * Get frequently bought together products
   * @param productId - Product ID
   * @param limit - Maximum number of products (default: 4)
   * @returns Array of frequently bought together products
   */
  getFrequentlyBoughtTogether: async (
    productId: string,
    limit: number = 4
  ): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/recommendations/frequently-bought/${productId}`,
      {
        params: { limit },
      }
    );
    return response.data.data!;
  },

  /**
   * Get personalized recommendations
   * @param limit - Maximum number of products (default: 12)
   * @returns Array of personalized product recommendations
   */
  getPersonalizedRecommendations: async (
    limit: number = 12
  ): Promise<ProductRecommendation[]> => {
    const response = await apiClient.get<ApiResponse<ProductRecommendation[]>>(
      "/recommendations/personalized",
      {
        params: { limit },
      }
    );
    return response.data.data!;
  },

  /**
   * Get trending products
   * @param limit - Maximum number of products (default: 10)
   * @returns Array of trending products
   */
  getTrendingProducts: async (limit: number = 10): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      "/recommendations/trending",
      {
        params: { limit },
      }
    );
    return response.data.data!;
  },

  /**
   * Record product view for recommendations
   * @param productId - Product ID
   * @returns Success status
   */
  recordProductView: async (productId: string): Promise<void> => {
    await apiClient.post("/recommendations/view", { productId });
  },
};

