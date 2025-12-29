import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  RazorpayOrderResponse,
  RazorpayPaymentVerification,
  RazorpayVerificationResponse,
} from "@/types";

export const paymentsService = {
  /**
   * Initialize Razorpay payment for an order
   */
  initializeRazorpayPayment: async (
    orderId: string
  ): Promise<RazorpayOrderResponse> => {
    const response = await apiClient.post<ApiResponse<RazorpayOrderResponse>>(
      `/payments/razorpay/${orderId}/initialize`
    );
    return response.data.data!;
  },

  /**
   * Verify Razorpay payment after successful checkout
   */
  verifyRazorpayPayment: async (
    orderId: string,
    paymentData: RazorpayPaymentVerification
  ): Promise<RazorpayVerificationResponse> => {
    const response = await apiClient.post<
      ApiResponse<RazorpayVerificationResponse>
    >(`/payments/razorpay/${orderId}/verify`, paymentData);
    return response.data.data!;
  },
};
