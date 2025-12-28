"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { AxiosError } from "axios";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageUploadProps {
  images: Array<{
    id?: string;
    url: string;
    altText?: string;
    isPrimary?: boolean;
  }>;
  onImagesChange: (
    images: Array<{ url: string; altText?: string; isPrimary?: boolean }>
  ) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Error",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      const response = await apiClient.post<{
        success: boolean;
        data: { urls: string[] };
      }>("/uploads/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newImages = response.data.data.urls.map((url) => ({
        url,
        altText: "",
        isPrimary: images.length === 0, // First image is primary by default
      }));

      onImagesChange([...images, ...newImages]);
      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            (error.response?.data as { message: string })?.message ||
            "Failed to upload images",
          variant: "destructive",
        });
      }
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the primary image, make the first one primary
    if (images[index]?.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    onImagesChange(newImages);
  };

  const setPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[#0a0a0a]">
          Product Images ({images.length}/{maxImages})
        </label>
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading || images.length >= maxImages}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-[8px] h-9 text-xs"
            disabled={uploading || images.length >= maxImages}
          >
            <span>
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              {uploading ? "Uploading..." : "Upload Images"}
            </span>
          </Button>
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group border border-[#e5e5e5] rounded-[10px] overflow-hidden bg-[#fafafa] aspect-square"
            >
              <Image
                src={image.url}
                alt={image.altText || `Product image ${index + 1}`}
                fill
                className="object-cover"
              />
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-[#0a0a0a] text-white text-xs font-medium px-2 py-0.5 rounded-[6px]">
                  Primary
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!image.isPrimary && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPrimary(index)}
                    className="h-8 w-8 p-0 rounded-[8px] bg-white/90 hover:bg-white text-[#0a0a0a]"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="h-8 w-8 p-0 rounded-[8px] bg-white/90 hover:bg-red-50 text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-[#e5e5e5] rounded-[10px] p-8 text-center">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-neutral-400" />
          <p className="text-xs text-neutral-500 font-medium mb-2">
            No images uploaded
          </p>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
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
                Upload Images
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
}
