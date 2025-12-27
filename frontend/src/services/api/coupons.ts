import apiClient from "@/lib/axios";
import { Coupon } from "@/types";

interface CouponsResponse {
  success: boolean;
  data: Coupon[];
}

interface CouponResponse {
  success: boolean;
  data: Coupon;
}

interface ValidateCouponResponse {
  success: boolean;
  data: {
    valid: boolean;
    coupon?: Coupon;
    discount?: number;
    message?: string;
  };
}

/**
 * Coupons API client
 * Handles all coupon-related API calls
 */
export const couponsApi = {
  /**
   * Get all available coupons
   * @returns Promise with coupons array
   */
  getCoupons: async (): Promise<CouponsResponse> => {
    const response = await apiClient.get<CouponsResponse>("/coupons");
    return response.data;
  },

  /**
   * Get coupon by code
   * @param code - Coupon code
   * @returns Promise with coupon data
   */
  getCouponByCode: async (code: string): Promise<CouponResponse> => {
    const response = await apiClient.get<CouponResponse>(`/coupons/${code}`);
    return response.data;
  },

  /**
   * Validate coupon code
   * @param code - Coupon code to validate
   * @param amount - Order amount for validation
   * @returns Promise with validation result
   */
  validateCoupon: async (
    code: string,
    amount: number
  ): Promise<ValidateCouponResponse> => {
    const response = await apiClient.post<ValidateCouponResponse>(
      `/coupons/${code}/validate`,
      { amount }
    );
    return response.data;
  },
};
