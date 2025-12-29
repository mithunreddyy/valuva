import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  ChangePasswordData,
  UpdateUserProfileData,
  User,
  UserStats,
} from "@/types";

/**
 * Users Service
 * Handles all user profile and account-related operations
 */
export const usersService = {
  /**
   * Get current user profile
   * @returns User profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>("/users/profile");
    return response.data.data!;
  },

  /**
   * Update user profile
   * @param data - Profile update data
   * @returns Updated user profile
   */
  updateProfile: async (data: UpdateUserProfileData): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      "/users/profile",
      data
    );
    return response.data.data!;
  },

  /**
   * Change user password
   * @param data - Password change data
   * @returns Success status
   */
  changePassword: async (data: ChangePasswordData): Promise<void> => {
    await apiClient.post("/users/change-password", data);
  },

  /**
   * Get user statistics
   * @returns User statistics
   */
  getUserStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<ApiResponse<UserStats>>(
      "/users/stats"
    );
    return response.data.data!;
  },

  /**
   * Delete user account
   * @param password - User password for confirmation
   * @returns Success status
   */
  deleteAccount: async (password: string): Promise<void> => {
    await apiClient.delete("/users/account", {
      data: { password },
    });
  },

  /**
   * Upload profile picture
   * @param file - Image file
   * @returns Updated user profile with new image URL
   */
  uploadProfilePicture: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post<ApiResponse<User>>(
      "/users/profile/picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data!;
  },
};
