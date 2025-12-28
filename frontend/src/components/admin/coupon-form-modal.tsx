"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { adminApi } from "@/services/api/admin";
import { Coupon } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import * as z from "zod";

const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(50, "Code must be at most 50 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Code must contain only uppercase letters, numbers, hyphens, and underscores"
    ),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number().positive("Discount value must be positive"),
  minPurchase: z.number().positive().optional().or(z.literal("")),
  maxDiscount: z.number().positive().optional().or(z.literal("")),
  usageLimit: z.number().int().positive().optional().or(z.literal("")),
  startsAt: z.string().min(1, "Start date is required"),
  expiresAt: z.string().min(1, "Expiry date is required"),
  isActive: z.boolean().default(true),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface CouponFormModalProps {
  coupon?: {
    id: string;
    code: string;
    description?: string;
    discountType: "PERCENTAGE" | "FIXED_AMOUNT";
    discountValue: number;
    minPurchase?: number;
    maxDiscount?: number;
    usageLimit?: number;
    isActive: boolean;
    startsAt: string;
    expiresAt: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CouponFormModal({
  coupon,
  isOpen,
  onClose,
}: CouponFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!coupon;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema) as unknown as Resolver<CouponFormData>,
    defaultValues: {
      code: coupon?.code || "",
      description: coupon?.description || "",
      discountType: coupon?.discountType || "PERCENTAGE",
      discountValue: coupon?.discountValue || 0,
      minPurchase: coupon?.minPurchase || undefined,
      maxDiscount: coupon?.maxDiscount || undefined,
      usageLimit: coupon?.usageLimit || undefined,
      startsAt: coupon?.startsAt
        ? new Date(coupon.startsAt).toISOString().slice(0, 16)
        : "",
      expiresAt: coupon?.expiresAt
        ? new Date(coupon.expiresAt).toISOString().slice(0, 16)
        : "",
      isActive: coupon?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (coupon) {
      reset({
        code: coupon.code,
        description: coupon.description || "",
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchase || undefined,
        maxDiscount: coupon.maxDiscount || undefined,
        usageLimit: coupon.usageLimit || undefined,
        startsAt: new Date(coupon.startsAt).toISOString().slice(0, 16),
        expiresAt: new Date(coupon.expiresAt).toISOString().slice(0, 16),
        isActive: coupon.isActive,
      });
    } else {
      reset({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minPurchase: undefined,
        maxDiscount: undefined,
        usageLimit: undefined,
        startsAt: "",
        expiresAt: "",
        isActive: true,
      });
    }
  }, [coupon, reset]);

  const createCoupon = useMutation({
    mutationFn: (data: Coupon) => adminApi.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast({
        title: "Success",
        description: "Coupon created successfully",
      });
      onClose();
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to create coupon",
        variant: "destructive",
      });
    },
  });

  const updateCoupon = useMutation({
    mutationFn: (data: Coupon) => adminApi.updateCoupon(coupon!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast({
        title: "Success",
        description: "Coupon updated successfully",
      });
      onClose();
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to update coupon",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CouponFormData) => {
    const payload = {
      ...data,
      minPurchase: data.minPurchase === "" ? undefined : data.minPurchase,
      maxDiscount: data.maxDiscount === "" ? undefined : data.maxDiscount,
      usageLimit: data.usageLimit === "" ? undefined : data.usageLimit,
      startsAt: new Date(data.startsAt).toISOString(),
      expiresAt: new Date(data.expiresAt).toISOString(),
    };

    if (isEditing) {
      updateCoupon.mutate(payload as Coupon);
    } else {
      createCoupon.mutate(payload as Coupon);
    }
  };

  const discountType = watch("discountType");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-[16px] w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#e5e5e5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] p-5 flex items-center justify-between z-10">
          <h2 className="text-lg font-medium tracking-normal">
            {isEditing ? "Edit Coupon" : "Create Coupon"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-[8px]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
          {/* Code */}
          <div>
            <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
              Coupon Code *
            </label>
            <Input
              {...register("code")}
              placeholder="SUMMER2025"
              className="rounded-[10px] h-10 text-sm"
              disabled={isEditing}
            />
            {errors.code && (
              <p className="text-xs text-red-600 mt-1">{errors.code.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
              Description
            </label>
            <Textarea
              {...register("description")}
              placeholder="Summer sale discount"
              className="rounded-[10px] text-sm min-h-[80px]"
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                Discount Type *
              </label>
              <Select
                value={watch("discountType")}
                onValueChange={(value: "PERCENTAGE" | "FIXED_AMOUNT") =>
                  setValue("discountType", value)
                }
              >
                <SelectTrigger className="rounded-[10px] h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                Discount Value *
              </label>
              <Input
                {...register("discountValue", { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder={discountType === "PERCENTAGE" ? "10" : "500"}
                className="rounded-[10px] h-10 text-sm"
              />
              {errors.discountValue && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.discountValue.message}
                </p>
              )}
            </div>
          </div>

          {/* Min Purchase & Max Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                Minimum Purchase
              </label>
              <Input
                {...register("minPurchase", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
                type="number"
                step="0.01"
                placeholder="1000"
                className="rounded-[10px] h-10 text-sm"
              />
            </div>
            {discountType === "PERCENTAGE" && (
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                  Maximum Discount
                </label>
                <Input
                  {...register("maxDiscount", {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  type="number"
                  step="0.01"
                  placeholder="500"
                  className="rounded-[10px] h-10 text-sm"
                />
              </div>
            )}
          </div>

          {/* Usage Limit */}
          <div>
            <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
              Usage Limit
            </label>
            <Input
              {...register("usageLimit", {
                valueAsNumber: true,
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
              type="number"
              placeholder="100"
              className="rounded-[10px] h-10 text-sm"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                Start Date *
              </label>
              <Input
                {...register("startsAt")}
                type="datetime-local"
                className="rounded-[10px] h-10 text-sm"
              />
              {errors.startsAt && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.startsAt.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                Expiry Date *
              </label>
              <Input
                {...register("expiresAt")}
                type="datetime-local"
                className="rounded-[10px] h-10 text-sm"
              />
              {errors.expiresAt && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.expiresAt.message}
                </p>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between py-2">
            <div>
              <label className="text-xs font-medium text-[#0a0a0a]">
                Active Status
              </label>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                Enable or disable this coupon
              </p>
            </div>
            <Switch
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
              className="data-[state=checked]:bg-[#0a0a0a]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e5e5]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-[10px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="filled"
              className="rounded-[10px]"
              disabled={createCoupon.isPending || updateCoupon.isPending}
            >
              {createCoupon.isPending || updateCoupon.isPending
                ? "Saving..."
                : isEditing
                ? "Update Coupon"
                : "Create Coupon"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
