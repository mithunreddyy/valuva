import apiClient from "@/lib/axios";
import {
  ApiResponse,
  ChangePasswordData,
  UpdateUserProfileData,
  User,
  UserStats,
} from "@/types";

export const usersApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>("/users/profile");
    return response.data;
  },

  updateProfile: async (
    data: UpdateUserProfileData
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.put<ApiResponse<User>>(
      "/users/profile",
      data
    );
    return response.data;
  },

  changePassword: async (
    data: ChangePasswordData
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      "/users/change-password",
      data
    );
    return response.data;
  },

  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    const response = await apiClient.get<ApiResponse<UserStats>>(
      "/users/stats"
    );
    return response.data;
  },
};

