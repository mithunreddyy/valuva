import { authApi } from "@/services/api/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

/**
 * Hook to get current user profile
 * @returns React Query hook for user profile data
 */
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getProfile(),
    retry: false,
  });
}

/**
 * Hook for user login
 * @returns Mutation hook for login
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authApi.login(data),
    onSuccess: (data) => {
      // Store tokens
      if (data.data?.accessToken && data.data?.refreshToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
      }
      // Invalidate profile query to refetch user data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push("/dashboard");
    },
  });
}

/**
 * Hook for user registration
 * @returns Mutation hook for registration
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }) => authApi.register(data),
    onSuccess: (data) => {
      // Store tokens
      if (data.data?.accessToken && data.data?.refreshToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
      }
      // Invalidate profile query to refetch user data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push("/dashboard");
    },
  });
}

/**
 * Hook for user logout
 * @returns Mutation hook for logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Clear all queries
      queryClient.clear();
      router.push("/");
    },
  });
}
