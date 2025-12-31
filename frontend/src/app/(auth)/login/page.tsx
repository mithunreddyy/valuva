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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-[400px]">
        {/* Logo and Brand */}
        <div className="text-center mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 mb-2 hover:opacity-80 transition-opacity"
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
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Sign in to your account to continue
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[#0a0a0a]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] text-[#0a0a0a] hover:underline font-medium transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <PasswordInput
                id="password"
                {...register("password")}
                placeholder="Enter your password"
                className="h-9 px-3 text-xs bg-white border border-[#e5e5e5] rounded-[12px] focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-400 pr-10"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-[10px] text-red-600 font-medium mt-1">
                  {errors.password.message}
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* OAuth Section */}
          <div className="mt-5">
            <OAuthButtons />
          </div>

          {/* Sign Up Link */}
          <div className="mt-5 text-center">
            <p className="text-xs text-neutral-400 font-normal">
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
        <div className="mt-5 text-center">
          <p className="text-[10px] text-neutral-400 font-normal">
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
