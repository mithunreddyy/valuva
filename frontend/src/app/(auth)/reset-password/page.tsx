"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/services/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
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
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#e5e5e5] p-8 sm:p-12 rounded-[12px] text-center">
            <h1 className="text-3xl sm:text-4xl font-medium tracking-normal mb-4">
              Invalid Link
            </h1>
            <p className="text-sm text-neutral-500 font-medium mb-6">
              This password reset link is invalid or has expired
            </p>
            <Link href="/forgot-password">
              <Button variant="filled" className="rounded-[10px]">
                Request New Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#e5e5e5] p-8 sm:p-12 rounded-[12px]">
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-medium tracking-normal">
              Reset Password
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              Enter your new password
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <Input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="rounded-[10px]"
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className="rounded-[10px]"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              variant="filled"
              className="w-full rounded-[10px]"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/login"
              className="text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

