import apiClient from "@/lib/axios";
import { Category } from "@/types";

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

interface CategoryResponse {
  success: boolean;
  data: Category;
}

/**
 * Categories API client
 * Handles all category-related API calls
 */
export const categoriesApi = {
  /**
   * Get all categories
   * @returns Promise with categories array
   */
  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await apiClient.get<CategoriesResponse>("/categories");
    return response.data;
  },

  /**
   * Get category by slug
   * @param slug - Category slug identifier
   * @returns Promise with category data
   */
  getCategoryBySlug: async (slug: string): Promise<CategoryResponse> => {
    const response = await apiClient.get<CategoryResponse>(
      `/categories/${slug}`
    );
    return response.data;
  },
};
