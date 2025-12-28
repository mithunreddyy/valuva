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
import { toast } from "@/hooks/use-toast";
import { adminApi } from "@/services/api/admin";
import { HomepageSection } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import { Resolver, useForm } from "react-hook-form";
import * as z from "zod";

const sectionSchema = z.object({
  type: z.enum([
    "HERO_BANNER",
    "FEATURED_PRODUCTS",
    "NEW_ARRIVALS",
    "BEST_SELLERS",
    "CATEGORY_SHOWCASE",
    "BANNER",
    "CUSTOM",
  ]),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

type SectionFormData = z.infer<typeof sectionSchema>;

interface HomepageSectionFormModalProps {
  section?: {
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    content?: HomepageSection["config"];
    isActive: boolean;
    sortOrder: number;
    config: Record<string, unknown>;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function HomepageSectionFormModal({
  section,
  isOpen,
  onClose,
}: HomepageSectionFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!section;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SectionFormData>({
    resolver: zodResolver(
      sectionSchema
    ) as unknown as Resolver<SectionFormData>,
    defaultValues: {
      type: (section?.type as SectionFormData["type"]) || "HERO_BANNER",
      title: section?.title || "",
      subtitle: section?.subtitle || "",
      config: section?.config || section?.content || {},
      isActive: section?.isActive ?? true,
      sortOrder: section?.sortOrder || 0,
    },
  });

  const createSection = useMutation({
    mutationFn: (data: HomepageSection) => adminApi.createHomepageSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-homepage-sections"] });
      toast({
        title: "Success",
        description: "Section created successfully",
      });
      onClose();
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to create section",
        variant: "destructive",
      });
    },
  });

  const updateSection = useMutation({
    mutationFn: (data: HomepageSection) =>
      adminApi.updateHomepageSection(section!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-homepage-sections"] });
      toast({
        title: "Success",
        description: "Section updated successfully",
      });
      onClose();
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to update section",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SectionFormData) => {
    const payload: Partial<HomepageSection> = {
      type: data.type,
      title: data.title,
      subtitle: data.subtitle,
      config: data.config || {},
      isActive: data.isActive,
      sortOrder: data.sortOrder,
    };

    if (isEditing) {
      updateSection.mutate(payload as HomepageSection);
    } else {
      createSection.mutate(payload as HomepageSection);
    }
  };

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
            {isEditing ? "Edit Section" : "Create Section"}
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
              Section Type *
            </label>
            <Select
              value={watch("type")}
              onValueChange={(value) =>
                setValue("type", value as SectionFormData["type"])
              }
            >
              <SelectTrigger className="rounded-[10px] h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HERO_BANNER">Hero Banner</SelectItem>
                <SelectItem value="FEATURED_PRODUCTS">
                  Featured Products
                </SelectItem>
                <SelectItem value="NEW_ARRIVALS">New Arrivals</SelectItem>
                <SelectItem value="BEST_SELLERS">Best Sellers</SelectItem>
                <SelectItem value="CATEGORY_SHOWCASE">
                  Category Showcase
                </SelectItem>
                <SelectItem value="BANNER">Banner</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-red-600 mt-1">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
              Title *
            </label>
            <Input
              {...register("title")}
              placeholder="Section title"
              className="rounded-[10px] h-10 text-sm"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
              Subtitle
            </label>
            <Input
              {...register("subtitle")}
              placeholder="Section subtitle"
              className="rounded-[10px] h-10 text-sm"
            />
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
                Section will be visible on homepage
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
              disabled={createSection.isPending || updateSection.isPending}
            >
              {createSection.isPending || updateSection.isPending
                ? "Saving..."
                : isEditing
                ? "Update Section"
                : "Create Section"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
