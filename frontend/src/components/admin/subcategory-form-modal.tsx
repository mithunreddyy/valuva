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
import { useCategories } from "@/hooks/use-categories";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { adminApi } from "@/services/api/admin";
import { SubCategory } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";

const subCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().url("Invalid URL").optional().or(z.literal("")),
  categoryId: z.string().uuid("Category is required"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

type SubCategoryFormData = z.infer<typeof subCategorySchema>;

interface SubCategoryFormModalProps {
  subCategory?: SubCategory;
  categoryId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SubCategoryFormModal({
  subCategory,
  categoryId: initialCategoryId,
  isOpen,
  onClose,
}: SubCategoryFormModalProps) {
  const queryClient = useQueryClient();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];
  const isEditing = !!subCategory;
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SubCategoryFormData>({
    resolver: zodResolver(
      subCategorySchema
    ) as unknown as Resolver<SubCategoryFormData>,
    defaultValues: {
      name: subCategory?.name || "",
      description: subCategory?.description || "",
      image: subCategory?.image || "",
      categoryId: subCategory?.categoryId || initialCategoryId,
      isActive: subCategory?.isActive ?? true,
      sortOrder: subCategory?.sortOrder || 0,
    },
  });

  const createSubCategory = useMutation({
    mutationFn: (data: SubCategory) => adminApi.createSubCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Subcategory created successfully",
      });
      onClose();
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to create subcategory",
        variant: "destructive",
      });
    },
  });

  const updateSubCategory = useMutation({
    mutationFn: (data: SubCategory) =>
      adminApi.updateSubCategory(subCategory!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Subcategory updated successfully",
      });
      onClose();
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to update subcategory",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiClient.post<{
        success: boolean;
        data: { url: string };
      }>("/uploads/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setValue("image", response.data.data.url);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            (error.response?.data as { message: string })?.message ||
            "Failed to upload image",
          variant: "destructive",
        });
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onSubmit = (data: SubCategoryFormData) => {
    const payload = {
      ...data,
      image: data.image || undefined,
    };

    if (isEditing) {
      updateSubCategory.mutate(payload as SubCategory);
    } else {
      createSubCategory.mutate(payload as SubCategory);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-[16px] w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#e5e5e5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] p-5 flex items-center justify-between z-10">
          <h2 className="text-lg font-medium tracking-normal">
            {isEditing ? "Edit Subcategory" : "Create Subcategory"}
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
              Category *
            </label>
            <Select
              value={watch("categoryId")}
              onValueChange={(value) => setValue("categoryId", value)}
              disabled={isEditing}
            >
              <SelectTrigger className="rounded-[10px] h-10 text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-red-600 mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
              Subcategory Name *
            </label>
            <Input
              {...register("name")}
              placeholder="e.g., Polo T-Shirts"
              className="rounded-[10px] h-10 text-sm"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
              Description
            </label>
            <Textarea
              {...register("description")}
              placeholder="Subcategory description"
              className="rounded-[10px] text-sm min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
              Image
            </label>
            <div className="space-y-2">
              {watch("image") && (
                <div className="relative w-32 h-32 border border-[#e5e5e5] rounded-[10px] overflow-hidden bg-[#fafafa]">
                  <Image  
                    src={watch("image") || ""}    
                    alt="Subcategory"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-[8px] h-9 text-xs"
                    disabled={uploading}
                  >
                    <span>
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      {uploading ? "Uploading..." : "Upload Image"}
                    </span>
                  </Button>
                </label>
                <Input
                  {...register("image")}
                  placeholder="Or enter image URL"
                  className="rounded-[10px] h-9 text-xs flex-1"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
              Sort Order
            </label>
            <Input
              {...register("sortOrder", { valueAsNumber: true })}
              type="number"
              placeholder="0"
              className="rounded-[10px] h-10 text-sm"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <label className="text-xs font-medium text-[#0a0a0a]">
                Active Status
              </label>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                Subcategory will be visible to customers
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
              className="rounded-[10px] h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="filled"
              className="rounded-[10px] h-10"
              disabled={
                createSubCategory.isPending || updateSubCategory.isPending
              }
            >
              {createSubCategory.isPending || updateSubCategory.isPending
                ? "Saving..."
                : isEditing
                ? "Update Subcategory"
                : "Create Subcategory"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
