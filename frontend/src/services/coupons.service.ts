import { apiClient } from "@/lib/api-client";
import { ApiResponse, Coupon, PaginatedResponse } from "@/types";

export const couponsService = {
  validateCoupon: async (code: string, subtotal?: number): Promise<Coupon> => {
    const response = await apiClient.get<ApiResponse<Coupon>>(
      `/coupons/validate/${code}`,
      {
        params: { subtotal },
      }
    );
    return response.data.data!;
  },

  getActiveCoupons: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Coupon>> => {
    const response = await apiClient.get<PaginatedResponse<Coupon>>(
      "/coupons",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },
};
