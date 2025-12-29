import apiClient from "@/lib/axios";
import {
  ApiResponse,
  NewsletterSubscription,
  NewsletterSubscriptionData,
} from "@/types";

export const newsletterApi = {
  subscribe: async (data: NewsletterSubscriptionData): Promise<void> => {
    await apiClient.post("/newsletter/subscribe", data);
  },

  unsubscribe: async (email: string, token?: string): Promise<void> => {
    await apiClient.post("/newsletter/unsubscribe", { email, token });
  },

  getSubscriptionStatus: async (
    email: string
  ): Promise<ApiResponse<NewsletterSubscription>> => {
    const response = await apiClient.get<ApiResponse<NewsletterSubscription>>(
      "/newsletter/status",
      {
        params: { email },
      }
    );
    return response.data;
  },
};

