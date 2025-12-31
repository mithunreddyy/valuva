"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/services/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true);
      await authApi.forgotPassword(data.email);
      setIsSubmitted(true);
      toast({
        title: "Email Sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to send reset email",
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

  if (isSubmitted) {
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

          {/* Success Card */}
          <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#e5e5e5] shadow-sm p-6 sm:p-8 lg:p-10 text-center">
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
                  Check Your Email
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
                  We&apos;ve sent password reset instructions to your email
                  address. Please check your inbox and follow the link to reset
                  your password.
                </p>
              </div>
              <Link href="/login">
                <Button
                  variant="filled"
                  size="default"
                  className="w-full h-10 sm:h-11 text-sm sm:text-[15px] font-medium bg-[#0a0a0a] hover:bg-[#1a1a1a] text-[#fafafa] border-0 rounded-[10px] transition-all"
                >
                  Back to Login
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
            Forgot Password?
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-medium">
            Enter your email to receive reset instructions
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#e5e5e5] shadow-sm p-6 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-[#0a0a0a] mb-1.5"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                className="h-10 sm:h-11 px-4 text-sm sm:text-[15px] bg-[#fafafa] border border-[#e5e5e5] rounded-[10px] focus:bg-white focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-500"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs sm:text-[13px] text-red-600 font-medium mt-1">
                  {errors.email.message}
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
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
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
