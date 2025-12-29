"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Lock, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  mfaToken: z.string().optional(),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [requiresMFA, setRequiresMFA] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginForm) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post("/admin/login", {
        email: data.email,
        password: data.password,
        mfaToken: data.mfaToken,
      });

      // Check if MFA is required
      if (response.data.data?.requiresMFA && !data.mfaToken) {
        setRequiresMFA(true);
        toast({
          title: "MFA Required",
          description: "Please enter your MFA code to continue",
        });
        return;
      }

      // Login successful
      const { admin, accessToken, refreshToken } = response.data.data;
      setAuth(
        {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          isActive: admin.isActive,
          isEmailVerified: true,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
        },
        accessToken,
        refreshToken
      );
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      router.push("/admin");
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
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0a0a0a] rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-[28px] font-medium tracking-normal text-[#0a0a0a] mb-2">
            Admin Login
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-medium">
            Secure admin access portal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-[#e5e5e5] shadow-sm p-6 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {!requiresMFA ? (
              <>
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
                    placeholder="admin@valuva.com"
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
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-medium text-[#0a0a0a] mb-1.5"
                  >
                    Password
                  </label>
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
              </>
            ) : (
              <div className="space-y-4">
                {/* MFA Info Banner */}
                <div className="flex items-center gap-2.5 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-[10px]">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-blue-700 font-medium">
                    Multi-factor authentication required
                  </p>
                </div>

                {/* MFA Code Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="mfaToken"
                    className="block text-xs sm:text-sm font-medium text-[#0a0a0a] mb-1.5"
                  >
                    MFA Code
                  </label>
                  <Input
                    id="mfaToken"
                    type="text"
                    {...register("mfaToken")}
                    placeholder="000000"
                    maxLength={6}
                    className="h-12 sm:h-14 px-4 text-lg sm:text-xl text-center tracking-[0.5em] bg-[#fafafa] border border-[#e5e5e5] rounded-[10px] focus:bg-white focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-400"
                    autoFocus
                  />
                  {errors.mfaToken && (
                    <p className="text-xs sm:text-[13px] text-red-600 font-medium mt-1">
                      {errors.mfaToken.message}
                    </p>
                  )}
                  <p className="text-xs sm:text-[13px] text-neutral-500 font-medium mt-2 leading-relaxed">
                    Enter the 6-digit code from your authenticator app or use a
                    backup code
                  </p>
                </div>
              </div>
            )}

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
              ) : requiresMFA ? (
                "Verify MFA"
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Back to Login Button (MFA only) */}
            {requiresMFA && (
              <Button
                type="button"
                variant="outline"
                size="default"
                className="w-full h-10 sm:h-11 text-sm sm:text-[15px] font-medium border border-[#e5e5e5] hover:border-[#0a0a0a] rounded-[10px] transition-all"
                onClick={() => {
                  setRequiresMFA(false);
                }}
              >
                Back to Login
              </Button>
            )}
          </form>

          {/* Footer Notice */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs text-neutral-500 font-medium">
              Admin access only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
