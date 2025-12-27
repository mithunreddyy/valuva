import apiClient from "@/lib/axios";
import { HomepageSection, Product } from "@/types";

interface HomepageResponse {
  success: boolean;
  data: HomepageSection[];
}

interface FeaturedProductsResponse {
  success: boolean;
  data: Product[];
}

/**
 * Homepage API client
 * Handles all homepage-related API calls
 */
export const homepageApi = {
  /**
   * Get homepage sections
   * @returns Promise with homepage sections array
   */
  getSections: async (): Promise<HomepageResponse> => {
    const response = await apiClient.get<HomepageResponse>(
      "/homepage/sections"
    );
    return response.data;
  },

  /**
   * Get featured products
   * @param limit - Optional limit for number of products
   * @returns Promise with featured products array
   */
  getFeaturedProducts: async (
    limit?: number
  ): Promise<FeaturedProductsResponse> => {
    const response = await apiClient.get<FeaturedProductsResponse>(
      "/homepage/featured",
      { params: { limit } }
    );
    return response.data;
  },

  /**
   * Get new arrival products
   * @param limit - Optional limit for number of products
   * @returns Promise with new arrival products array
   */
  getNewArrivals: async (limit?: number): Promise<FeaturedProductsResponse> => {
    const response = await apiClient.get<FeaturedProductsResponse>(
      "/homepage/new-arrivals",
      { params: { limit } }
    );
    return response.data;
  },
};
