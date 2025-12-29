import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  CreateReviewData,
  PaginatedResponse,
  Review,
  UpdateReviewData,
} from "@/types";

/**
 * Reviews Service
 * Handles all review-related operations
 */
export const reviewsService = {
  /**
   * Get reviews for a product
   * @param productId - Product ID
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Paginated reviews
   */
  getProductReviews: async (
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<PaginatedResponse<Review>>(
      `/products/${productId}/reviews`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  /**
   * Get user's reviews
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Paginated reviews
   */
  getUserReviews: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<PaginatedResponse<Review>>("/reviews", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get a single review by ID
   * @param reviewId - Review ID
   * @returns Review
   */
  getReviewById: async (reviewId: string): Promise<Review> => {
    const response = await apiClient.get<ApiResponse<Review>>(
      `/reviews/${reviewId}`
    );
    return response.data.data!;
  },

  /**
   * Create a new review
   * @param data - Review data
   * @returns Created review
   */
  createReview: async (data: CreateReviewData): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(
      "/reviews",
      data
    );
    return response.data.data!;
  },

  /**
   * Update a review
   * @param reviewId - Review ID
   * @param data - Updated review data
   * @returns Updated review
   */
  updateReview: async (
    reviewId: string,
    data: UpdateReviewData
  ): Promise<Review> => {
    const response = await apiClient.put<ApiResponse<Review>>(
      `/reviews/${reviewId}`,
      data
    );
    return response.data.data!;
  },

  /**
   * Delete a review
   * @param reviewId - Review ID
   * @returns Success status
   */
  deleteReview: async (reviewId: string): Promise<void> => {
    await apiClient.delete(`/reviews/${reviewId}`);
  },
};

