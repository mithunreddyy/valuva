import { usersApi } from "@/services/api/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";

export function useProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => usersApi.getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: usersApi.changePassword,
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive",
      });
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ["user-stats"],
    queryFn: () => usersApi.getUserStats(),
  });
}

