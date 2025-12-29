import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  CreateStockAlertData,
  PaginatedResponse,
  StockAlert,
} from "@/types";

/**
 * Stock Alerts Service
 * Handles stock alert operations for out-of-stock products
 */
export const stockAlertsService = {
  /**
   * Get user's stock alerts
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @returns Paginated stock alerts
   */
  getUserAlerts: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<StockAlert>> => {
    const response = await apiClient.get<PaginatedResponse<StockAlert>>(
      "/stock-alerts",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  /**
   * Get a single stock alert by ID
   * @param alertId - Alert ID
   * @returns Stock alert
   */
  getAlertById: async (alertId: string): Promise<StockAlert> => {
    const response = await apiClient.get<ApiResponse<StockAlert>>(
      `/stock-alerts/${alertId}`
    );
    return response.data.data!;
  },

  /**
   * Create a stock alert
   * @param data - Stock alert data
   * @returns Created stock alert
   */
  createAlert: async (data: CreateStockAlertData): Promise<StockAlert> => {
    const response = await apiClient.post<ApiResponse<StockAlert>>(
      "/stock-alerts",
      data
    );
    return response.data.data!;
  },

  /**
   * Delete a stock alert
   * @param alertId - Alert ID
   * @returns Success status
   */
  deleteAlert: async (alertId: string): Promise<void> => {
    await apiClient.delete(`/stock-alerts/${alertId}`);
  },

  /**
   * Delete stock alert by product ID
   * @param productId - Product ID
   * @returns Success status
   */
  deleteAlertByProductId: async (productId: string): Promise<void> => {
    await apiClient.delete(`/stock-alerts/product/${productId}`);
  },

  /**
   * Check if user has an alert for a product
   * @param productId - Product ID
   * @returns Boolean indicating if alert exists
   */
  hasAlert: async (productId: string): Promise<boolean> => {
    const response = await apiClient.get<ApiResponse<{ hasAlert: boolean }>>(
      `/stock-alerts/check/${productId}`
    );
    return response.data.data!.hasAlert;
  },
};

