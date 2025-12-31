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
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 bg-[#0a0a0a] rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#0a0a0a] mb-1 leading-[0.95]">
            Admin Login
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Secure admin access portal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!requiresMFA ? (
              <>
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
                    placeholder="admin@valuva.com"
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
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-[#0a0a0a] mb-1.5"
                  >
                    Password
                  </label>
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
              </>
            ) : (
              <div className="space-y-3">
                {/* MFA Info Banner */}
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-[12px]">
                  <Lock className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-700 font-normal">
                    Multi-factor authentication required
                  </p>
                </div>

                {/* MFA Code Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="mfaToken"
                    className="block text-xs font-medium text-[#0a0a0a] mb-1.5"
                  >
                    MFA Code
                  </label>
                  <Input
                    id="mfaToken"
                    type="text"
                    {...register("mfaToken")}
                    placeholder="000000"
                    maxLength={6}
                    className="h-10 px-4 text-base text-center tracking-[0.5em] bg-white border border-[#e5e5e5] rounded-[12px] focus:border-[#0a0a0a] focus:ring-0 transition-all placeholder:text-neutral-400"
                    autoFocus
                  />
                  {errors.mfaToken && (
                    <p className="text-[10px] text-red-600 font-medium mt-1">
                      {errors.mfaToken.message}
                    </p>
                  )}
                  <p className="text-[10px] text-neutral-400 font-normal mt-1.5 leading-relaxed">
                    Enter the 6-digit code from your authenticator app or use a
                    backup code
                  </p>
                </div>
              </div>
            )}

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
                size="sm"
                className="w-full h-9 text-xs font-medium border border-[#e5e5e5] hover:border-[#0a0a0a] rounded-[12px] transition-all"
                onClick={() => {
                  setRequiresMFA(false);
                }}
              >
                Back to Login
              </Button>
            )}
          </form>

          {/* Footer Notice */}
          <div className="mt-5 text-center">
            <p className="text-[10px] text-neutral-400 font-normal">
              Admin access only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
