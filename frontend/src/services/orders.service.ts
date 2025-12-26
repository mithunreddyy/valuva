import { apiClient } from "@/lib/api-client";
import { ApiResponse, Order, PaginatedResponse, PaymentMethod } from "@/types";

export interface CreateOrderData {
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}

export const ordersService = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      "/orders/checkout",
      data
    );
    return response.data.data!;
  },

  getOrders: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>("/orders", {
      params: { page, limit },
    });
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data!;
  },
};
