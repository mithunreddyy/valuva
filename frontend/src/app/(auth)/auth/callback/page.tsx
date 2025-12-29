"use client";

import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const success = searchParams.get("success");
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (success === "true" && accessToken && refreshToken) {
      // Decode JWT to get user info (basic implementation)
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const user: User = {
          id: payload.userId,
          email: payload.email,
          role: payload.role,
          firstName: "",
          lastName: "",
          isEmailVerified: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setAuth(user, accessToken, refreshToken);

        // Get redirect URL from session storage or default to dashboard
        const redirectPath =
          typeof window !== "undefined"
            ? sessionStorage.getItem("oauth_redirect") || "/dashboard"
            : "/dashboard";

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("oauth_redirect");
        }

        // Use setTimeout to avoid cascading renders
        setTimeout(() => {
          setStatus("success");
          toast({
            title: "Success",
            description: "Signed in successfully",
          });
          router.push(redirectPath);
        }, 100);
      } catch (err) {
        console.error("Token parsing error:", err);
        setTimeout(() => {
          setStatus("error");
        }, 100);
        toast({
          title: "Error",
          description: "Failed to process authentication token",
          variant: "destructive",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } else if (success === "false" || error) {
      setTimeout(() => {
        setStatus("error");
      }, 100);
      const errorMessage = error
        ? decodeURIComponent(error)
        : "Authentication failed";
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="text-center space-y-4 max-w-md w-full">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-neutral-600 font-medium">
              Completing sign in...
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-neutral-600 font-medium">
              Sign in successful! Redirecting...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-sm text-neutral-600 font-medium">
              Sign in failed. Redirecting to login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
