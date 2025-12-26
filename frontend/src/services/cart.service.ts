import { apiClient } from "@/lib/api-client";
import { ApiResponse, Cart } from "@/types";

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>("/cart");
    return response.data.data!;
  },

  addToCart: async (variantId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>("/cart/items", {
      variantId,
      quantity,
    });
    return response.data.data!;
  },

  updateCartItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.put<ApiResponse<Cart>>(
      `/cart/items/${itemId}`,
      {
        quantity,
      }
    );
    return response.data.data!;
  },

  removeCartItem: async (itemId: string): Promise<Cart> => {
    const response = await apiClient.delete<ApiResponse<Cart>>(
      `/cart/items/${itemId}`
    );
    return response.data.data!;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await apiClient.delete<ApiResponse<Cart>>("/cart");
    return response.data.data!;
  },
};
