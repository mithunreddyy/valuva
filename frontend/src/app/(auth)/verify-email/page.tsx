"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/services/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isVerifying, setIsVerifying] = useState(!!token);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      setIsVerifying(true);
      await authApi.verifyEmail(verificationToken);
      setIsVerified(true);
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Verification Failed",
        description: errorMessage || "Invalid or expired verification link",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerification = async () => {
    try {
      setIsResending(true);
      await authApi.resendVerification();
      toast({
        title: "Email Sent",
        description: "Verification email has been sent",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage || "Failed to send verification email",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#e5e5e5] p-8 sm:p-12 rounded-[12px] text-center">
          {isVerifying ? (
            <div className="space-y-4">
              <div className="w-16 h-16 border-4 border-[#0a0a0a] border-t-transparent rounded-full animate-spin mx-auto" />
              <h1 className="text-3xl sm:text-4xl font-medium tracking-normal">
                Verifying...
              </h1>
              <p className="text-sm text-neutral-500 font-medium">
                Please wait while we verify your email
              </p>
            </div>
          ) : isVerified ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
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
              <h1 className="text-3xl sm:text-4xl font-medium tracking-normal">
                Email Verified!
              </h1>
              <p className="text-sm text-neutral-500 font-medium">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-medium tracking-normal mb-2">
                  Verify Your Email
                </h1>
                <p className="text-sm text-neutral-500 font-medium">
                  We&apos;ve sent a verification link to your email address
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={resendVerification}
                  variant="outline"
                  className="w-full rounded-[10px]"
                  disabled={isResending}
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  variant="filled"
                  className="w-full rounded-[10px]"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
