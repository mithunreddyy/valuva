"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/services/api/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isVerifying, setIsVerifying] = useState(!!token);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const verifyEmail = useCallback(
    async (verificationToken: string) => {
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
    },
    [router]
  );

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

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

        {/* Content Card */}
        <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#e5e5e5] shadow-sm p-6 sm:p-8 lg:p-10 text-center">
          {isVerifying ? (
            <div className="space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-[3px] border-[#0a0a0a] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-[28px] font-medium tracking-normal text-[#0a0a0a]">
                  Verifying...
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 font-medium">
                  Please wait while we verify your email
                </p>
              </div>
            </div>
          ) : isVerified ? (
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
                  Email Verified!
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 font-medium">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto border border-[#e5e5e5]">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-[28px] font-medium tracking-normal text-[#0a0a0a]">
                  Verify Your Email
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
                  We&apos;ve sent a verification link to your email address.
                  Please check your inbox and click the link to verify your
                  account.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <Button
                  onClick={resendVerification}
                  variant="outline"
                  size="default"
                  className="w-full h-10 sm:h-11 text-sm sm:text-[15px] font-medium border border-[#e5e5e5] hover:border-[#0a0a0a] rounded-[10px] transition-all disabled:opacity-50"
                  disabled={isResending}
                >
                  {isResending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  variant="filled"
                  size="default"
                  className="w-full h-10 sm:h-11 text-sm sm:text-[15px] font-medium bg-[#0a0a0a] hover:bg-[#1a1a1a] text-[#fafafa] border-0 rounded-[10px] transition-all"
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
