"use client";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/services/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast({
        title: "Error",
        description: "Invalid reset token",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await authApi.resetPassword(token, data.password);
      toast({
        title: "Success",
        description: "Password reset successfully",
      });
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to reset password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-1 sm:px-3 py-3 sm:py-3">
        <div className="w-full max-w-[420px]">
          {/* Logo and Brand */}
          <div className="text-center mb-1 sm:mb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 sm:gap-1 mb-1 sm:mb-2 hover:opacity-80 transition-opacity justify-center"
            >
              <Image
                src="/valuvaLogo.png"
                alt="VALUVA"
                width={60}
                height={60}
                className="w-15 h-15 sm:w-15 sm:h-15 object-contain"
                priority
              />
              {/* <span className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                valuva
              </span> */}
            </Link>
          </div>

          {/* Invalid Token Card */}
          <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#e5e5e5] shadow-sm p-6 sm:p-8 lg:p-10 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
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
                  Invalid Link
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
                  This password reset link is invalid or has expired
                </p>
              </div>
              <Link href="/forgot-password">
                <Button
                  variant="filled"
                  size="default"
                  className="w-full h-10 sm:h-11 text-sm sm:text-[15px] font-medium bg-[#0a0a0a] hover:bg-[#1a1a1a] text-[#fafafa] border-0 rounded-[10px] transition-all"
                >
                  Request New Link
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl sm:text-[28px] font-medium tracking-normal text-[#0a0a0a] mb-2">
            Reset Password
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-medium">
            Enter your new password
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#e5e5e5] shadow-sm p-6 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-[#0a0a0a] mb-1.5"
              >
                New Password
              </label>
              <PasswordInput
                id="password"
                {...register("password")}
                placeholder="At least 8 characters"
                className="h-10 sm:h-11 px-4 text-sm sm:text-[15px] bg-[#fafafa] border border-[#e5e5e5] rounded-[10px] focus:bg-white focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-500 pr-12"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-xs sm:text-[13px] text-red-600 font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-xs sm:text-sm font-medium text-[#0a0a0a] mb-1.5"
              >
                Confirm Password
              </label>
              <PasswordInput
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Re-enter your password"
                className="h-10 sm:h-11 px-4 text-sm sm:text-[15px] bg-[#fafafa] border border-[#e5e5e5] rounded-[10px] focus:bg-white focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-500 pr-12"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-xs sm:text-[13px] text-red-600 font-medium mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="default"
              variant="filled"
              className="w-full h-10 sm:h-11 text-sm sm:text-[15px] font-medium bg-[#0a0a0a] hover:bg-[#1a1a1a] text-[#fafafa] border-0 rounded-[10px] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#fafafa] border-t-transparent rounded-full animate-spin" />
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href="/login"
              className="text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
