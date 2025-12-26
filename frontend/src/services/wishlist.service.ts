import { apiClient } from "@/lib/api-client";
import { ApiResponse, WishlistItem } from "@/types";

export const wishlistService = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await apiClient.get<ApiResponse<WishlistItem[]>>(
      "/wishlist"
    );
    return response.data.data!;
  },

  addToWishlist: async (productId: string): Promise<WishlistItem[]> => {
    const response = await apiClient.post<ApiResponse<WishlistItem[]>>(
      "/wishlist/items",
      {
        productId,
      }
    );
    return response.data.data!;
  },

  removeFromWishlist: async (productId: string): Promise<WishlistItem[]> => {
    const response = await apiClient.delete<ApiResponse<WishlistItem[]>>(
      `/wishlist/items/${productId}`
    );
    return response.data.data!;
  },
};

