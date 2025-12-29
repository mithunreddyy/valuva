"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";
import {
  useChangePassword,
  useProfile,
  useUpdateProfile,
  useUserStats,
} from "@/hooks/use-users";
import { formatPrice } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  DollarSign,
  Lock,
  Package,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
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
    updateProfile.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Profile updated!",
          description: "Your profile information has been updated successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const onPasswordSubmit = (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword?: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password do not match",
        variant: "destructive",
      });
      return;
    }
    changePassword.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast({
            title: "Password updated!",
            description: "Your password has been changed successfully",
          });
          resetPassword();
          setShowPasswordForm(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description:
              "Failed to change password. Please check your current password.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="space-y-6">
            <div className="h-12 bg-[#e5e5e5] rounded-[20px] animate-pulse"></div>
            <div className="h-64 bg-[#e5e5e5] rounded-[20px] animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <p className="text-lg font-medium text-neutral-600">
            Please sign in to view your dashboard
          </p>
        </motion.div>
      </div>
    );
  }

  const stats = statsData?.data;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-6 sm:py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-normal text-[#0a0a0a]">
              My Profile
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 font-medium">
              Manage your account information and preferences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="bg-[#fafafa] border-b border-[#e5e5e5]">
          <div className="container-luxury py-6 sm:py-8 lg:py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
            >
              {[
                {
                  icon: Package,
                  label: "Total Orders",
                  value: stats.totalOrders,
                  color: "text-blue-600",
                },
                {
                  icon: ShoppingBag,
                  label: "Pending",
                  value: stats.pendingOrders,
                  color: "text-yellow-600",
                },
                {
                  icon: DollarSign,
                  label: "Total Spent",
                  value: formatPrice(stats.totalSpent),
                  color: "text-green-600",
                },
                {
                  icon: CheckCircle,
                  label: "Completed",
                  value: stats.completedOrders,
                  color: "text-green-600",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white border border-[#e5e5e5] p-5 sm:p-6 rounded-[20px] hover:border-[#0a0a0a] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="text-xs sm:text-sm text-neutral-500 font-medium">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-medium text-[#0a0a0a]">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Profile Form Section */}
      <section className="container-luxury py-6 sm:py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12"
        >
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] p-5 sm:p-6 lg:p-8 rounded-[20px] hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <User className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-normal text-[#0a0a0a]">
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
                className="w-full rounded-[16px] gap-2"
              >
                {updateProfile.isPending ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] p-5 sm:p-6 lg:p-8 rounded-[20px] hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Lock className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Change Password
              </h2>
            </div>
            <AnimatePresence mode="wait">
              {!showPasswordForm ? (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-neutral-600 font-medium leading-relaxed">
                    Update your password to keep your account secure.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full rounded-[16px]"
                  >
                    Change Password
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="open"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
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
                      className="flex-1 rounded-[16px] gap-2"
                    >
                      {changePassword.isPending ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowPasswordForm(false);
                        resetPassword();
                      }}
                      className="rounded-[16px]"
                      aria-label="Cancel password change"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
