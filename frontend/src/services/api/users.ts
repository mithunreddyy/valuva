import apiClient from "@/lib/axios";
import { User } from "@/types";

interface UserResponse {
  success: boolean;
  data: User;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
}

interface UserStatsResponse {
  success: boolean;
  data: UserStats;
}

export const usersApi = {
  getProfile: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>("/users/profile");
    return response.data;
  },

  updateProfile: async (
    data: Partial<Pick<User, "firstName" | "lastName" | "phone">>
  ): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>("/users/profile", data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean }> => {
    const response = await apiClient.post("/users/change-password", data);
    return response.data;
  },

  getUserStats: async (): Promise<UserStatsResponse> => {
    const response = await apiClient.get<UserStatsResponse>("/users/stats");
    return response.data;
  },
};

