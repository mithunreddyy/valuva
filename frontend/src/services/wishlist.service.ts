import { apiClient } from "@/lib/api-client";
import { AddToWishlistData, ApiResponse, WishlistItem } from "@/types";

export const wishlistService = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await apiClient.get<ApiResponse<WishlistItem[]>>(
      "/wishlist"
    );
    return response.data.data!;
  },

  addToWishlist: async (data: AddToWishlistData): Promise<WishlistItem[]> => {
    const response = await apiClient.post<ApiResponse<WishlistItem[]>>(
      "/wishlist/items",
      data
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
