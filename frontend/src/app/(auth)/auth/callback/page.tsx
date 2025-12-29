"use client";

import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types";
import Image from "next/image";
import Link from "next/link";
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
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo and Brand */}
        <div className="text-center mb-8 sm:mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-[1px] mb-6 sm:mb-8 hover:opacity-80 transition-opacity justify-center"
          >
            <Image
              src="/valuvaLogo.png"
              alt="VALUVA"
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              priority
            />
            <span className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              valuva
            </span>
          </Link>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#e5e5e5] shadow-sm p-6 sm:p-8 lg:p-10 text-center">
          {status === "loading" && (
            <div className="space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-[3px] border-[#0a0a0a] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-[28px] font-medium tracking-normal text-[#0a0a0a]">
                  Completing sign in...
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 font-medium">
                  Please wait while we authenticate your account
                </p>
              </div>
            </div>
          )}
          {status === "success" && (
            <div className="space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#f0f9f4] rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-[28px] font-medium tracking-normal text-[#0a0a0a]">
                  Sign in successful!
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 font-medium">
                  Redirecting to your dashboard...
                </p>
              </div>
            </div>
          )}
          {status === "error" && (
            <div className="space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-[28px] font-medium tracking-normal text-[#0a0a0a]">
                  Sign in failed
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 font-medium">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
