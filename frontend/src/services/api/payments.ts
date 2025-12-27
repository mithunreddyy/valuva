import apiClient from "@/lib/axios";

interface PaymentResponse {
  success: boolean;
  data: {
    id: string;
    orderId: string;
    status: string;
    method: string;
    transactionId?: string;
  };
}

export const paymentsApi = {
  confirmPayment: async (
    orderId: string,
    transactionId: string
  ): Promise<PaymentResponse> => {
    const response = await apiClient.post<PaymentResponse>(
      `/payments/${orderId}/confirm`,
      { transactionId }
    );
    return response.data;
  },
};

