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
      <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="text-center mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 mb-2 hover:opacity-80 transition-opacity justify-center"
            >
              <Image
                src="/valuvaLogo.png"
                alt="VALUVA"
                width={50}
                height={50}
                className="w-12 h-12 object-contain"
                priority
              />
            </Link>
          </div>

          {/* Invalid Token Card */}
          <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-5 sm:p-6 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-red-600"
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
              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]">
                  Invalid Link
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
                  This password reset link is invalid or has expired
                </p>
              </div>
              <Link href="/forgot-password">
                <Button
                  variant="filled"
                  size="sm"
                  className="w-full h-9 text-xs font-medium rounded-[12px] mt-4"
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-[400px]">
        {/* Logo and Brand */}
        <div className="text-center mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 mb-2 hover:opacity-80 transition-opacity justify-center"
          >
            <Image
              src="/valuvaLogo.png"
              alt="VALUVA"
              width={50}
              height={50}
              className="w-12 h-12 object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#0a0a0a] mb-1 leading-[0.95]">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Enter your new password
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[#0a0a0a] mb-1.5"
              >
                New Password
              </label>
              <PasswordInput
                id="password"
                {...register("password")}
                placeholder="At least 8 characters"
                className="h-9 px-3 text-xs bg-white border border-[#e5e5e5] rounded-[12px] focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-400 pr-10"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-[10px] text-red-600 font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-medium text-[#0a0a0a] mb-1.5"
              >
                Confirm Password
              </label>
              <PasswordInput
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Re-enter your password"
                className="h-9 px-3 text-xs bg-white border border-[#e5e5e5] rounded-[12px] focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-400 pr-10"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-[10px] text-red-600 font-medium mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="sm"
              variant="filled"
              className="w-full h-9 text-xs font-medium rounded-[12px] mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="text-xs text-neutral-400 hover:text-[#0a0a0a] transition-colors font-normal"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
