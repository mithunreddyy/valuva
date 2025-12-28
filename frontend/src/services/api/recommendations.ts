import apiClient from "@/lib/axios";
import { Product } from "@/types";

export const recommendationsApi = {
  getRecentlyViewed: async (): Promise<Product[]> => {
    const response = await apiClient.get("/recommendations/recently-viewed");
    return response.data.data;
  },

  getSimilarProducts: async (productId: string): Promise<Product[]> => {
    const response = await apiClient.get(
      `/recommendations/similar/${productId}`
    );
    return response.data.data;
  },

  getFrequentlyBoughtTogether: async (
    productId: string
  ): Promise<Product[]> => {
    const response = await apiClient.get(
      `/recommendations/frequently-bought/${productId}`
    );
    return response.data.data;
  },
};

