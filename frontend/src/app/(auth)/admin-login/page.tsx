"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Shield, Lock } from "lucide-react";
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
  const [adminId, setAdminId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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
        setAdminId(response.data.data.adminId);
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
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#e5e5e5] p-8 sm:p-12 rounded-[12px]">
          <div className="text-center mb-8 space-y-2">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium tracking-normal">
              Admin Login
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              Secure admin access portal
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {!requiresMFA ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="admin@valuva.com"
                    className="rounded-[10px]"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <PasswordInput
                    {...register("password")}
                    placeholder="••••••••"
                    className="rounded-[10px] pr-10"
                  />
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-[10px]">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <p className="text-xs text-blue-700 font-medium">
                    Multi-factor authentication required
                  </p>
                </div>
                <label className="block text-sm font-medium mb-2">
                  MFA Code
                </label>
                <Input
                  type="text"
                  {...register("mfaToken")}
                  placeholder="000000"
                  maxLength={6}
                  className="rounded-[10px] text-center text-lg tracking-widest"
                  autoFocus
                />
                {errors.mfaToken && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    {errors.mfaToken.message}
                  </p>
                )}
                <p className="text-xs text-neutral-500 font-medium mt-2">
                  Enter the 6-digit code from your authenticator app or use a
                  backup code
                </p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              variant="filled"
              className="w-full rounded-[10px]"
              disabled={isLoading}
            >
              {isLoading
                ? "Signing in..."
                : requiresMFA
                ? "Verify MFA"
                : "Sign In"}
            </Button>

            {requiresMFA && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full rounded-[10px]"
                onClick={() => {
                  setRequiresMFA(false);
                  setAdminId(null);
                }}
              >
                Back to Login
              </Button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500 font-medium">
              Admin access only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

