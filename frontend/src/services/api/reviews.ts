import apiClient from "@/lib/axios";
import {
  ApiResponse,
  CreateReviewData,
  PaginatedResponse,
  Review,
  UpdateReviewData,
} from "@/types";

/**
 * Reviews API client
 * Handles all review-related API calls
 */
export const reviewsApi = {
  /**
   * Get reviews for a product
   * @param productId - Product ID
   * @param params - Optional pagination parameters
   * @returns Promise with reviews array
   */
  getProductReviews: async (
    productId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<PaginatedResponse<Review>>(
      `/products/${productId}/reviews`,
      { params }
    );
    return response.data;
  },

  /**
   * Create a new review
   * @param data - Review data
   * @returns Promise with created review
   */
  createReview: async (data: CreateReviewData): Promise<ApiResponse<Review>> => {
    const response = await apiClient.post<ApiResponse<Review>>("/reviews", data);
    return response.data;
  },

  /**
   * Update a review
   * @param reviewId - Review ID
   * @param data - Updated review data
   * @returns Promise with updated review
   */
  updateReview: async (
    reviewId: string,
    data: UpdateReviewData
  ): Promise<ApiResponse<Review>> => {
    const response = await apiClient.put<ApiResponse<Review>>(
      `/reviews/${reviewId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a review
   * @param reviewId - Review ID
   * @returns Promise with success status
   */
  deleteReview: async (reviewId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};
