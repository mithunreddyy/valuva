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

          {/* Success Card */}
          <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-5 sm:p-6 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-green-600"
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
              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]">
                  Check Your Email
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
                  We&apos;ve sent password reset instructions to your email
                  address. Please check your inbox and follow the link to reset
                  your password.
                </p>
              </div>
              <Link href="/login">
                <Button
                  variant="filled"
                  size="sm"
                  className="w-full h-9 text-xs font-medium rounded-[12px] mt-4"
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
            Forgot Password?
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Enter your email to receive reset instructions
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[#0a0a0a] mb-1.5"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                className="h-9 px-3 text-xs bg-white border border-[#e5e5e5] rounded-[12px] focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-400"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-[10px] text-red-600 font-medium mt-1">
                  {errors.email.message}
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
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
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
