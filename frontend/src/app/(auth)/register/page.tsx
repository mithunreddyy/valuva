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
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#e5e5e5] p-8 sm:p-12 rounded-[12px]">
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-medium tracking-normal">
              Create Account
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              Join us today
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <Input
                  {...register("firstName")}
                  placeholder="John"
                  className="rounded-[10px]"
                />
                {errors.firstName && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name
                </label>
                <Input
                  {...register("lastName")}
                  placeholder="Doe"
                  className="rounded-[10px]"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                {...register("email")}
                placeholder="your@email.com"
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
                Phone (Optional)
              </label>
              <Input
                {...register("phone")}
                placeholder="+91 1234567890"
                className="rounded-[10px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
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

            <p className="text-xs text-neutral-500 font-medium text-center leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms-of-service"
                className="text-[#0a0a0a] underline hover:no-underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-[#0a0a0a] underline hover:no-underline"
              >
                Privacy Policy
              </Link>
              .
            </p>

            <Button
              type="submit"
              size="lg"
              variant="filled"
              className="w-full rounded-[10px]"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <OAuthButtons mode="register" />

          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-600 font-medium">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-[#0a0a0a] hover:underline font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
