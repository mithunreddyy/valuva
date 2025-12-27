"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useChangePassword,
  useProfile,
  useUpdateProfile,
  useUserStats,
} from "@/hooks/use-users";
import { formatPrice } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { DollarSign, Lock, Package, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export default function DashboardPage() {
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: statsData } = useUserStats();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const user = profileData?.data || authUser;

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm();

  const onProfileSubmit = (data: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    updateProfile.mutate(data);
  };

  const onPasswordSubmit = (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    changePassword.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    resetPassword();
    setShowPasswordForm(false);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="space-y-6">
            <div className="h-12 bg-[#e5e5e5] rounded-[12px] animate-pulse"></div>
            <div className="h-64 bg-[#e5e5e5] rounded-[12px] animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const stats = statsData?.data;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-normal">
              My Profile
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              Manage your account information
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="bg-[#fafafa] border-b border-[#e5e5e5]">
          <div className="container-luxury py-8 sm:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e5e5e5] p-5 rounded-[12px]">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="h-5 w-5 text-neutral-500" />
                  <span className="text-xs text-neutral-500 font-medium">
                    Total Orders
                  </span>
                </div>
                <p className="text-2xl font-medium">{stats.totalOrders}</p>
              </div>
              <div className="bg-white border border-[#e5e5e5] p-5 rounded-[12px]">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag className="h-5 w-5 text-neutral-500" />
                  <span className="text-xs text-neutral-500 font-medium">
                    Pending
                  </span>
                </div>
                <p className="text-2xl font-medium">{stats.pendingOrders}</p>
              </div>
              <div className="bg-white border border-[#e5e5e5] p-5 rounded-[12px]">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-neutral-500" />
                  <span className="text-xs text-neutral-500 font-medium">
                    Total Spent
                  </span>
                </div>
                <p className="text-2xl font-medium">
                  {formatPrice(stats.totalSpent)}
                </p>
              </div>
              <div className="bg-white border border-[#e5e5e5] p-5 rounded-[12px]">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="h-5 w-5 text-neutral-500" />
                  <span className="text-xs text-neutral-500 font-medium">
                    Completed
                  </span>
                </div>
                <p className="text-2xl font-medium">{stats.completedOrders}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Profile Form Section */}
      <section className="container-luxury py-8 sm:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Profile Information */}
          <div className="bg-white border border-[#e5e5e5] p-6 sm:p-8 rounded-[12px]">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5" />
              <h2 className="text-2xl font-medium tracking-normal">
                Profile Information
              </h2>
            </div>
            <form
              onSubmit={handleProfileSubmit(onProfileSubmit)}
              className="space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <Input
                    {...registerProfile("firstName", {
                      required: "First name is required",
                    })}
                    className="rounded-[10px]"
                  />
                  {profileErrors.firstName && (
                    <p className="text-xs text-red-600 mt-1">
                      {profileErrors.firstName.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <Input
                    {...registerProfile("lastName", {
                      required: "Last name is required",
                    })}
                    className="rounded-[10px]"
                  />
                  {profileErrors.lastName && (
                    <p className="text-xs text-red-600 mt-1">
                      {profileErrors.lastName.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={user.email}
                  disabled
                  className="rounded-[10px] bg-[#fafafa]"
                />
                <p className="text-xs text-neutral-500 mt-1 font-medium">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  {...registerProfile("phone")}
                  className="rounded-[10px]"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                variant="filled"
                disabled={updateProfile.isPending}
                className="w-full rounded-[10px]"
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white border border-[#e5e5e5] p-6 sm:p-8 rounded-[12px]">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-5 w-5" />
              <h2 className="text-2xl font-medium tracking-normal">
                Change Password
              </h2>
            </div>
            {!showPasswordForm ? (
              <div className="space-y-4">
                <p className="text-sm text-neutral-600 font-medium">
                  Update your password to keep your account secure.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full rounded-[10px]"
                >
                  Change Password
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handlePasswordSubmit(
                  onPasswordSubmit as SubmitHandler<FieldValues>
                )}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    {...registerPassword("currentPassword", {
                      required: "Current password is required",
                    })}
                    className="rounded-[10px]"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordErrors.currentPassword.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    {...registerPassword("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="rounded-[10px]"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordErrors.newPassword.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    {...registerPassword("confirmPassword", {
                      required: "Please confirm your password",
                    })}
                    className="rounded-[10px]"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordErrors.confirmPassword.message as string}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    variant="filled"
                    disabled={changePassword.isPending}
                    className="flex-1 rounded-[10px]"
                  >
                    {changePassword.isPending
                      ? "Updating..."
                      : "Update Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordForm(false);
                      resetPassword();
                    }}
                    className="rounded-[10px]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
