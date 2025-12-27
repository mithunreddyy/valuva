import { reviewsApi } from "@/services/api/reviews";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CreateReviewData {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
}

/**
 * Hook to fetch reviews for a product
 * @param productId - Product ID
 * @param params - Optional pagination parameters
 * @returns React Query hook for product reviews
 */
export function useProductReviews(
  productId: string,
  params?: { page?: number; limit?: number }
) {
  return useQuery({
    queryKey: ["reviews", productId, params],
    queryFn: () => reviewsApi.getProductReviews(productId, params),
    enabled: !!productId,
  });
}

/**
 * Hook to create a review
 * @returns Mutation hook for creating review
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewsApi.createReview(data),
    onSuccess: (_, variables) => {
      // Invalidate reviews for the product
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });
      // Also invalidate product query to update rating
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
  });
}

/**
 * Hook to update a review
 * @returns Mutation hook for updating review
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: Partial<CreateReviewData>;
    }) => reviewsApi.updateReview(reviewId, data),
    onSuccess: (_, variables) => {
      // Invalidate reviews queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      if (variables.data.productId) {
        queryClient.invalidateQueries({
          queryKey: ["product", variables.data.productId],
        });
      }
    },
  });
}

/**
 * Hook to delete a review
 * @returns Mutation hook for deleting review
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      // Invalidate all reviews queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
