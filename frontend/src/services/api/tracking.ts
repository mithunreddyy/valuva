import apiClient from "@/lib/axios";

export interface TrackingUpdate {
  id: string;
  status: string;
  location?: string;
  description?: string;
  timestamp: string;
}

export interface OrderTracking {
  orderId: string;
  orderNumber: string;
  currentStatus: string;
  updates: TrackingUpdate[];
  estimatedDelivery?: string;
}

interface TrackingResponse {
  success: boolean;
  data: OrderTracking;
}

export const trackingApi = {
  trackOrder: async (orderNumber: string): Promise<TrackingResponse> => {
    const response = await apiClient.get<TrackingResponse>(
      `/tracking/${orderNumber}`
    );
    return response.data;
  },

  trackOrderPublic: async (
    orderNumber: string,
    email: string
  ): Promise<TrackingResponse> => {
    const response = await apiClient.post<TrackingResponse>(
      `/tracking/public`,
      { orderNumber, email }
    );
    return response.data;
  },
};

