import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";

export interface RazorpayOrderResponse {
  orderId: string;
  amount: string;
  currency: string;
  keyId: string;
  receipt: string;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerificationResponse {
  success: boolean;
  transactionId: string;
  orderId: string;
  amount: string;
}

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

