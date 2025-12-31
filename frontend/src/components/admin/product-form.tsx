"use client";

import { ImageUpload } from "@/components/admin/image-upload";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { toast } from "@/hooks/use-toast";
import { adminApi } from "@/services/api/admin";
import { Product, ProductImage } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Resolver, useFieldArray, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  basePrice: z.number().positive("Price must be positive"),
  compareAtPrice: z.number().positive().optional().or(z.literal("")),
  sku: z.string().min(1, "SKU is required"),
  brand: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  washCareInstructions: z.string().optional(),
  categoryId: z.string().uuid("Category is required"),
  subCategoryId: z.string().uuid().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .optional(),
  sizeGuide: z
    .object({
      title: z.string().optional(),
      measurements: z
        .array(
          z.object({
            size: z.string().min(1, "Size is required"),
            brandSize: z.string().optional(),
            chest: z.string().optional(),
            frontLength: z.string().optional(),
            waist: z.string().optional(),
            acrossShoulder: z.string().optional(),
            sleeveLength: z.string().optional(),
            collar: z.string().optional(),
          })
        )
        .optional(),
      notes: z.string().optional(),
    })
    .optional(),
  shippingInfo: z
    .object({
      processingTime: z.string().optional(),
      shippingTime: z.string().optional(),
      freeShipping: z.boolean().optional(),
      returnable: z.boolean().optional(),
      exchangeable: z.boolean().optional(),
    })
    .optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        sku: z.string().min(1, "SKU is required"),
        size: z.string().min(1, "Size is required"),
        color: z.string().min(1, "Color is required"),
        colorHex: z.string().optional(),
        stock: z.number().int().min(0, "Stock must be non-negative"),
        price: z.number().positive("Price must be positive"),
        isActive: z.boolean().default(true),
      })
    )
    .min(1, "At least one variant is required"),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid URL"),
        altText: z.string().optional(),
        isPrimary: z.boolean().default(false),
      })
    )
    .min(1, "At least one image is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  isNew?: boolean;
}

export function ProductForm({ product, isNew = false }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categoriesData } = useCategories();
  const categories = useMemo(
    () => categoriesData?.data || [],
    [categoriesData?.data]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(
      productSchema
    ) as unknown as Resolver<ProductFormData>,
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      shortDescription: product?.shortDescription || "",
      longDescription: product?.longDescription || "",
      basePrice: product?.basePrice ? Number(product.basePrice) : 0,
      compareAtPrice: product?.compareAtPrice
        ? Number(product.compareAtPrice)
        : undefined,
      sku: product?.sku || "",
      brand: product?.brand || "",
      material: product?.material || "",
      careInstructions: product?.careInstructions || "",
      washCareInstructions: product?.washCareInstructions || "",
      categoryId: product?.categoryId || "",
      subCategoryId: product?.subCategoryId || "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      isNewArrival: product?.isNewArrival ?? false,
      specifications: product?.specifications
        ? Object.entries(product.specifications).map(([key, value]) => ({
            key,
            value: String(value),
          }))
        : [],
      sizeGuide: product?.sizeGuide || undefined,
      shippingInfo: product?.shippingInfo || undefined,
      variants: product?.variants?.map((v) => ({
        id: v.id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        colorHex: v.colorHex,
        stock: v.stock,
        price: Number(v.price),
        isActive: v.isActive,
      })) || [
        {
          sku: "",
          size: "",
          color: "",
          colorHex: "",
          stock: 0,
          price: 0,
          isActive: true,
        },
      ],
      images:
        product?.images?.map((img) => ({
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
        })) || [],
    },
  });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  const sizeGuideValue = useWatch({ control, name: "sizeGuide" });
  const {
    fields: sizeGuideFields,
    append: appendSizeGuide,
    remove: removeSizeGuide,
  } = useFieldArray({
    control,
    name: "sizeGuide.measurements",
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  // Watch categoryId from form instead of maintaining separate state
  const categoryId = useWatch({ control, name: "categoryId" });

  // Derive subCategories from the watched categoryId
  const subCategories = useMemo(() => {
    if (!categoryId) return [];
    const category = categories.find((c) => c.id === categoryId);
    return category?.subCategories || [];
  }, [categoryId, categories]);

  const createProduct = useMutation({
    mutationFn: (data: Product) => adminApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      router.push("/admin/products");
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const updateProduct = useMutation({
    mutationFn: (data: Product) => adminApi.updateProduct(product!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-product", product!.id],
      });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      router.push("/admin/products");
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    const payload = {
      ...data,
      compareAtPrice:
        data.compareAtPrice === "" ? undefined : data.compareAtPrice,
      subCategoryId: data.subCategoryId === "" ? undefined : data.subCategoryId,
      specifications:
        data.specifications && data.specifications.length > 0
          ? Object.fromEntries(data.specifications.map((s) => [s.key, s.value]))
          : undefined,
      sizeGuide:
        data.sizeGuide &&
        (data.sizeGuide.title ||
          (data.sizeGuide.measurements &&
            data.sizeGuide.measurements.length > 0) ||
          data.sizeGuide.notes)
          ? {
              title: data.sizeGuide.title || undefined,
              measurements:
                data.sizeGuide.measurements &&
                data.sizeGuide.measurements.length > 0
                  ? data.sizeGuide.measurements
                      .filter((m) => m.size) // Only include entries with size
                      .map((m) => {
                        // Remove empty fields
                        const cleaned: Record<string, string> = {
                          size: m.size,
                        };
                        if (m.brandSize) cleaned.brandSize = m.brandSize;
                        if (m.chest) cleaned.chest = m.chest;
                        if (m.frontLength) cleaned.frontLength = m.frontLength;
                        if (m.waist) cleaned.waist = m.waist;
                        if (m.acrossShoulder)
                          cleaned.acrossShoulder = m.acrossShoulder;
                        if (m.sleeveLength)
                          cleaned.sleeveLength = m.sleeveLength;
                        if (m.collar) cleaned.collar = m.collar;
                        return cleaned;
                      })
                  : undefined,
              notes: data.sizeGuide.notes || undefined,
            }
          : undefined,
      // Don't send variant IDs for new variants
      variants: data.variants.map((v) => ({
        ...v,
        id: isNew ? undefined : v.id,
      })),
    };

    if (isNew) {
      createProduct.mutate(payload as Product);
    } else {
      updateProduct.mutate(payload as Product);
    }
  };

  const images = useWatch({ control, name: "images" }) as ProductImage[];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-5">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 rounded-[10px] bg-[#fafafa]">
            <TabsTrigger
              value="basic"
              className="text-xs font-medium rounded-[8px]"
            >
              Basic Info
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="text-xs font-medium rounded-[8px]"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="variants"
              className="text-xs font-medium rounded-[8px]"
            >
              Variants
            </TabsTrigger>
            <TabsTrigger
              value="images"
              className="text-xs font-medium rounded-[8px]"
            >
              Images
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-xs font-medium rounded-[8px]"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                  Product Name *
                </label>
                <Input
                  {...register("name")}
                  placeholder="Enter product name"
                  className="rounded-[10px] h-10 text-sm"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                  SKU *
                </label>
                <Input
                  {...register("sku")}
                  placeholder="PROD-001"
                  className="rounded-[10px] h-10 text-sm"
                />
                {errors.sku && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.sku.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                Description *
              </label>
              <Textarea
                {...register("description")}
                placeholder="Brief product description"
                className="rounded-[10px] text-sm min-h-[100px]"
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                Short Description
              </label>
              <Textarea
                {...register("shortDescription")}
                placeholder="Short description for product cards"
                className="rounded-[10px] text-sm min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                  Base Price (₹) *
                </label>
                <Input
                  {...register("basePrice", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="rounded-[10px] h-10 text-sm"
                />
                {errors.basePrice && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.basePrice.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                  Compare At Price (₹)
                </label>
                <Input
                  {...register("compareAtPrice", {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="rounded-[10px] h-10 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                  Category *
                </label>
                <Select
                  value={categoryId || ""}
                  onValueChange={(value) => {
                    setValue("categoryId", value);
                    setValue("subCategoryId", "");
                  }}
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
                  Subcategory
                </label>
                <Select
                  value={useWatch({ control, name: "subCategoryId" }) || ""}
                  onValueChange={(value) => setValue("subCategoryId", value)}
                  disabled={!categoryId || subCategories.length === 0}
                >
                  <SelectTrigger className="rounded-[10px] h-10 text-sm">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                  Brand
                </label>
                <Input
                  {...register("brand")}
                  placeholder="Brand name"
                  className="rounded-[10px] h-10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                  Material
                </label>
                <Input
                  {...register("material")}
                  placeholder="e.g., Cotton, Polyester"
                  className="rounded-[10px] h-10 text-sm"
                />
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-0">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                Long Description
              </label>
              <Textarea
                {...register("longDescription")}
                placeholder="Detailed product description (supports HTML)"
                className="rounded-[10px] text-sm min-h-[150px]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                Care Instructions
              </label>
              <Textarea
                {...register("careInstructions")}
                placeholder="Basic care instructions"
                className="rounded-[10px] text-sm min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                Wash Care Instructions
              </label>
              <Textarea
                {...register("washCareInstructions")}
                placeholder="Detailed wash care instructions"
                className="rounded-[10px] text-sm min-h-[100px]"
              />
            </div>

            {/* Specifications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#0a0a0a]">
                  Specifications
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSpec({ key: "", value: "" })}
                  className="rounded-[8px] h-8 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {specFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      {...register(`specifications.${index}.key`)}
                      placeholder="Key"
                      className="rounded-[8px] h-9 text-xs flex-1"
                    />
                    <Input
                      {...register(`specifications.${index}.value`)}
                      placeholder="Value"
                      className="rounded-[8px] h-9 text-xs flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpec(index)}
                      className="h-9 w-9 p-0 rounded-[8px] text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Guide */}
            <div className="border-t border-[#e5e5e5] pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium text-[#0a0a0a]">
                  Size Guide
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!sizeGuideValue) {
                      setValue("sizeGuide", {
                        title: "",
                        measurements: [],
                        notes: "",
                      });
                    }
                    appendSizeGuide({
                      size: "",
                      brandSize: "",
                      chest: "",
                      frontLength: "",
                      waist: "",
                      acrossShoulder: "",
                      sleeveLength: "",
                      collar: "",
                    });
                  }}
                  className="rounded-[8px] h-8 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Size
                </Button>
              </div>

              <div className="space-y-3">
                <Input
                  {...register("sizeGuide.title")}
                  placeholder="Size Guide Title (optional)"
                  className="rounded-[8px] h-9 text-xs mb-3"
                />

                {sizeGuideFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-[#e5e5e5] rounded-[8px] p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#0a0a0a]">
                        Size Entry {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSizeGuide(index)}
                        className="h-7 w-7 p-0 rounded-[6px] text-red-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Input
                        {...register(`sizeGuide.measurements.${index}.size`)}
                        placeholder="Size (e.g., S, M, L, XL)"
                        className="rounded-[8px] h-9 text-xs"
                      />
                      <Input
                        {...register(
                          `sizeGuide.measurements.${index}.brandSize`
                        )}
                        placeholder="Brand Size (optional)"
                        className="rounded-[8px] h-9 text-xs"
                      />
                      <Input
                        {...register(`sizeGuide.measurements.${index}.chest`)}
                        placeholder="Chest (inches)"
                        className="rounded-[8px] h-9 text-xs"
                      />
                      <Input
                        {...register(
                          `sizeGuide.measurements.${index}.frontLength`
                        )}
                        placeholder="Front Length (inches)"
                        className="rounded-[8px] h-9 text-xs"
                      />
                      <Input
                        {...register(`sizeGuide.measurements.${index}.waist`)}
                        placeholder="Waist (inches)"
                        className="rounded-[8px] h-9 text-xs"
                      />
                      <Input
                        {...register(
                          `sizeGuide.measurements.${index}.acrossShoulder`
                        )}
                        placeholder="Across Shoulder (inches)"
                        className="rounded-[8px] h-9 text-xs"
                      />
                      <Input
                        {...register(
                          `sizeGuide.measurements.${index}.sleeveLength`
                        )}
                        placeholder="Sleeve Length (inches)"
                        className="rounded-[8px] h-9 text-xs"
                      />
                      <Input
                        {...register(`sizeGuide.measurements.${index}.collar`)}
                        placeholder="Collar (inches)"
                        className="rounded-[8px] h-9 text-xs"
                      />
                    </div>
                  </div>
                ))}

                <Textarea
                  {...register("sizeGuide.notes")}
                  placeholder="Size guide notes or instructions (optional)"
                  className="rounded-[8px] text-xs min-h-[80px] mt-3"
                />
              </div>
            </div>
          </TabsContent>

          {/* Variants Tab */}
          <TabsContent value="variants" className="space-y-4 mt-0">
            <div className="space-y-3">
              {variantFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-[#e5e5e5] rounded-[10px] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#0a0a0a]">
                      Variant {index + 1}
                    </span>
                    {variantFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="h-7 w-7 p-0 rounded-[6px] text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Input
                      {...register(`variants.${index}.sku`)}
                      placeholder="SKU"
                      className="rounded-[8px] h-9 text-xs"
                    />
                    <Input
                      {...register(`variants.${index}.size`)}
                      placeholder="Size"
                      className="rounded-[8px] h-9 text-xs"
                    />
                    <Input
                      {...register(`variants.${index}.color`)}
                      placeholder="Color"
                      className="rounded-[8px] h-9 text-xs"
                    />
                    <Input
                      {...register(`variants.${index}.colorHex`)}
                      placeholder="#000000"
                      type="color"
                      className="rounded-[8px] h-9 w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      {...register(`variants.${index}.stock`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      placeholder="Stock"
                      className="rounded-[8px] h-9 text-xs"
                    />
                    <Input
                      {...register(`variants.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      className="rounded-[8px] h-9 text-xs"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendVariant({
                    sku: "",
                    size: "",
                    color: "",
                    colorHex: "",
                    stock: 0,
                    price: 0,
                    isActive: true,
                  })
                }
                className="w-full rounded-[8px] h-9 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Variant
              </Button>
            </div>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4 mt-0">
            <ImageUpload
              images={images}
              onImagesChange={(newImages) =>
                setValue(
                  "images",
                  newImages.map((img) => ({
                    ...img,
                    isPrimary: img.isPrimary ?? false,
                  }))
                )
              }
              maxImages={10}
            />
            {errors.images && (
              <p className="text-xs text-red-600">{errors.images.message}</p>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-xs font-medium text-[#0a0a0a]">
                    Active Status
                  </label>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">
                    Product will be visible to customers
                  </p>
                </div>
                <Switch
                  checked={useWatch({ control, name: "isActive" }) ?? false}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                  className="data-[state=checked]:bg-[#0a0a0a]"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-xs font-medium text-[#0a0a0a]">
                    Featured Product
                  </label>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">
                    Show on homepage featured section
                  </p>
                </div>
                <Switch
                  checked={useWatch({ control, name: "isFeatured" }) ?? false}
                  onCheckedChange={(checked) => setValue("isFeatured", checked)}
                  className="data-[state=checked]:bg-[#0a0a0a]"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-xs font-medium text-[#0a0a0a]">
                    New Arrival
                  </label>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">
                    Mark as new arrival product
                  </p>
                </div>
                <Switch
                  checked={useWatch({ control, name: "isNewArrival" }) ?? false}
                  onCheckedChange={(checked) =>
                    setValue("isNewArrival", checked)
                  }
                  className="data-[state=checked]:bg-[#0a0a0a]"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e5e5]">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          className="rounded-[10px] h-10"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="filled"
          className="rounded-[10px] h-10"
          disabled={createProduct.isPending || updateProduct.isPending}
        >
          {createProduct.isPending || updateProduct.isPending
            ? "Saving..."
            : isNew
            ? "Create Product"
            : "Update Product"}
        </Button>
      </div>
    </form>
  );
}
