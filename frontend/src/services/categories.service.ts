import { apiClient } from "@/lib/api-client";
import { ApiResponse, Category } from "@/types";

export const categoriesService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      "/categories"
    );
    return response.data.data!;
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      `/categories/${slug}`
    );
    return response.data.data!;
  },
};
