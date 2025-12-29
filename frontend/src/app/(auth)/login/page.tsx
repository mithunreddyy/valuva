"use client";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/services/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(data);
      setAuth(
        response.data.user,
        response.data.accessToken,
        response.data.refreshToken
      );
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Login failed",
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

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo and Brand */}
        <div className="text-center mb-2 sm:mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 sm:gap-1 mb-2 sm:mb-4 hover:opacity-80 transition-opacity"
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
            Welcome back
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-medium">
            Sign in to your account to continue
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-[#0a0a0a]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs sm:text-[13px] text-[#0a0a0a] hover:underline font-medium transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <PasswordInput
                id="password"
                {...register("password")}
                placeholder="Enter your password"
                className="h-10 sm:h-11 px-4 text-sm sm:text-[15px] bg-[#fafafa] border border-[#e5e5e5] rounded-[10px] focus:bg-white focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-500 pr-12"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-xs sm:text-[13px] text-red-600 font-medium mt-1">
                  {errors.password.message}
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* OAuth Section */}
          <div className="mt-8">
            <OAuthButtons mode="login" />
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-neutral-600 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#0a0a0a] hover:underline font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs text-neutral-500 font-medium">
            By signing in, you agree to our{" "}
            <Link
              href="/terms-of-service"
              className="text-[#0a0a0a] hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-[#0a0a0a] hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
