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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-1"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]">
              My Profile
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-normal">
              Manage your account information and preferences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="bg-white border-b border-[#e5e5e5]">
          <div className="container-luxury py-6 sm:py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
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
                  className="bg-white border border-[#e5e5e5] p-4 rounded-[16px] hover:border-[#0a0a0a] transition-all"
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-xs text-neutral-500 font-normal">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-medium text-[#0a0a0a]">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Profile Form Section */}
      <section className="container-luxury py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-4 sm:gap-6"
        >
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] p-5 rounded-[16px]"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-[10px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <User className="h-4 w-4 text-[#0a0a0a]" />
              </div>
              <h2 className="text-base font-medium tracking-normal text-[#0a0a0a]">
                Profile Information
              </h2>
            </div>
            <form
              onSubmit={handleProfileSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    First Name
                  </label>
                  <Input
                    {...registerProfile("firstName", {
                      required: "First name is required",
                    })}
                    className="rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]"
                  />
                  {profileErrors.firstName && (
                    <p className="text-[10px] text-red-600 mt-1 font-normal">
                      {profileErrors.firstName.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Last Name
                  </label>
                  <Input
                    {...registerProfile("lastName", {
                      required: "Last name is required",
                    })}
                    className="rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]"
                  />
                  {profileErrors.lastName && (
                    <p className="text-[10px] text-red-600 mt-1 font-normal">
                      {profileErrors.lastName.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">Email</label>
                <Input
                  value={user.email}
                  disabled
                  className="rounded-[10px] h-9 text-xs bg-[#fafafa] border-[#e5e5e5]"
                />
                <p className="text-[10px] text-neutral-500 mt-1 font-normal">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">Phone</label>
                <Input
                  {...registerProfile("phone")}
                  className="rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]"
                />
              </div>

              <Button
                type="submit"
                size="sm"
                variant="filled"
                disabled={updateProfile.isPending}
                className="w-full rounded-[12px] gap-1.5"
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
            className="bg-white border border-[#e5e5e5] p-5 rounded-[16px]"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-[10px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Lock className="h-4 w-4 text-[#0a0a0a]" />
              </div>
              <h2 className="text-base font-medium tracking-normal text-[#0a0a0a]">
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
                className="space-y-2.5"
              >
                <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                  Update your password to keep your account secure.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full rounded-[12px] border-[#e5e5e5] hover:border-[#0a0a0a]"
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
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    {...registerPassword("currentPassword", {
                      required: "Current password is required",
                    })}
                    className="rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-[10px] text-red-600 mt-1 font-normal">
                      {passwordErrors.currentPassword.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5">
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
                    className="rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-[10px] text-red-600 mt-1 font-normal">
                      {passwordErrors.newPassword.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    {...registerPassword("confirmPassword", {
                      required: "Please confirm your password",
                    })}
                    className="rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-[10px] text-red-600 mt-1 font-normal">
                      {passwordErrors.confirmPassword.message as string}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    variant="filled"
                    disabled={changePassword.isPending}
                    className="flex-1 rounded-[12px] gap-1.5"
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
                    size="sm"
                    onClick={() => {
                      setShowPasswordForm(false);
                      resetPassword();
                    }}
                    className="rounded-[12px] border-[#e5e5e5] hover:border-[#0a0a0a]"
                    aria-label="Cancel password change"
                  >
                    <X className="h-3.5 w-3.5" />
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
