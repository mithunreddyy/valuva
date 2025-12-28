"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { adminApi } from "@/services/api/admin";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import * as z from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().url("Invalid URL").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  category?: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryFormModal({
  category,
  isOpen,
  onClose,
}: CategoryFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!category;
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(
      categorySchema
    ) as unknown as Resolver<CategoryFormData>,
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      image: category?.image || "",
      isActive: category?.isActive ?? true,
      sortOrder: category?.sortOrder || 0,
    },
  });

  const createCategory = useMutation({
    mutationFn: (data: Category) => adminApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      onClose();
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const updateCategory = useMutation({
    mutationFn: (data: Category) => adminApi.updateCategory(category!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      onClose();
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to update category",
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

  const onSubmit = (data: CategoryFormData) => {
    const payload = {
      ...data,
      image: data.image || undefined,
    };

    if (isEditing) {
      updateCategory.mutate(payload as Category);
    } else {
      createCategory.mutate(payload as Category);
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
            {isEditing ? "Edit Category" : "Create Category"}
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
              Category Name *
            </label>
            <Input
              {...register("name")}
              placeholder="e.g., T-Shirts"
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
              placeholder="Category description"
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
                  <img
                    src={watch("image")}
                    alt="Category"
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
            {errors.image && (
              <p className="text-xs text-red-600 mt-1">
                {errors.image.message}
              </p>
            )}
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
                Category will be visible to customers
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
              disabled={createCategory.isPending || updateCategory.isPending}
            >
              {createCategory.isPending || updateCategory.isPending
                ? "Saving..."
                : isEditing
                ? "Update Category"
                : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
