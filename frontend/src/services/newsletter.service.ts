import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  NewsletterSubscription,
  NewsletterSubscriptionData,
} from "@/types";

/**
 * Newsletter Service
 * Handles newsletter subscription operations
 */
export const newsletterService = {
  /**
   * Subscribe to newsletter
   * @param data - Subscription data (email)
   * @returns Success status
   */
  subscribe: async (data: NewsletterSubscriptionData): Promise<void> => {
    await apiClient.post("/newsletter/subscribe", data);
  },

  /**
   * Unsubscribe from newsletter
   * @param email - Email address
   * @param token - Optional unsubscribe token
   * @returns Success status
   */
  unsubscribe: async (
    email: string,
    token?: string
  ): Promise<void> => {
    await apiClient.post("/newsletter/unsubscribe", { email, token });
  },

  /**
   * Get subscription status
   * @param email - Email address
   * @returns Subscription status
   */
  getSubscriptionStatus: async (
    email: string
  ): Promise<NewsletterSubscription> => {
    const response = await apiClient.get<ApiResponse<NewsletterSubscription>>(
      "/newsletter/status",
      {
        params: { email },
      }
    );
    return response.data.data!;
  },

  /**
   * Resend confirmation email
   * @param email - Email address
   * @returns Success status
   */
  resendConfirmation: async (email: string): Promise<void> => {
    await apiClient.post("/newsletter/resend-confirmation", { email });
  },
};

