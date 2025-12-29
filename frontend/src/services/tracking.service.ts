import { apiClient } from "@/lib/api-client";
import { ApiResponse, OrderTracking } from "@/types";

/**
 * Order Tracking Service
 * Handles order tracking operations
 */
export const trackingService = {
  /**
   * Track order by order number (authenticated)
   * @param orderNumber - Order number
   * @returns Order tracking information
   */
  trackOrder: async (orderNumber: string): Promise<OrderTracking> => {
    const response = await apiClient.get<ApiResponse<OrderTracking>>(
      `/tracking/${orderNumber}`
    );
    return response.data.data!;
  },

  /**
   * Track order publicly (without authentication)
   * @param orderNumber - Order number
   * @param email - Email address for verification
   * @returns Order tracking information
   */
  trackOrderPublic: async (
    orderNumber: string,
    email: string
  ): Promise<OrderTracking> => {
    const response = await apiClient.post<ApiResponse<OrderTracking>>(
      "/tracking/public",
      { orderNumber, email }
    );
    return response.data.data!;
  },

  /**
   * Get tracking updates for an order
   * @param orderNumber - Order number
   * @returns Order tracking with all updates
   */
  getTrackingUpdates: async (
    orderNumber: string
  ): Promise<OrderTracking> => {
    const response = await apiClient.get<ApiResponse<OrderTracking>>(
      `/tracking/${orderNumber}/updates`
    );
    return response.data.data!;
  },
};

