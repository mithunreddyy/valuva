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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(data);
      setAuth(
        response.data.user,
        response.data.accessToken,
        response.data.refreshToken
      );
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Registration failed",
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
            Create your account
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Join us and start shopping today
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="firstName"
                  className="block text-xs font-medium text-[#0a0a0a] mb-1.5"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="John"
                  className="h-9 px-3 text-xs bg-white border border-[#e5e5e5] rounded-[12px] focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-400"
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <p className="text-[10px] text-red-600 font-medium mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="lastName"
                  className="block text-xs font-medium text-[#0a0a0a] mb-1.5"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Doe"
                  className="h-9 px-3 text-xs bg-white border border-[#e5e5e5] rounded-[12px] focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-400"
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <p className="text-[10px] text-red-600 font-medium mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

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

            {/* Phone Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="block text-xs font-medium text-[#0a0a0a] mb-1.5"
              >
                Phone{" "}
                <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="+91 1234567890"
                className="h-9 px-3 text-xs bg-white border border-[#e5e5e5] rounded-[12px] focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-400"
                autoComplete="tel"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[#0a0a0a] mb-1.5"
              >
                Password
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

            {/* Terms and Privacy */}
            <p className="text-[10px] text-neutral-400 font-normal leading-relaxed pt-1">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms-of-service"
                className="text-[#0a0a0a] hover:underline transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-[#0a0a0a] hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>

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
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* OAuth Section */}
          <div className="mt-5">
            <OAuthButtons />
          </div>

          {/* Sign In Link */}
          <div className="mt-5 text-center">
            <p className="text-xs text-neutral-400 font-normal">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#0a0a0a] hover:underline font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
