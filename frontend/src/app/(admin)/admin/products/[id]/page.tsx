"use client";

import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi } from "@/services/api/admin";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminProductEditPage() {
  const params = useParams();
  const productId = params.id as string;
  const isNew = productId === "new";

  const { data, isLoading } = useQuery({
    queryKey: ["admin-product", productId],
    queryFn: async () => {
      const response = await adminApi.getProductById(productId);
      return response.data;
    },
    enabled: !isNew,
  });

  if (isLoading && !isNew) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-10 w-48 mb-4 rounded-[12px]" />
        <Skeleton className="h-96 w-full rounded-[16px]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-4 flex items-center gap-3 border-b border-[#e5e5e5] pb-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm" className="rounded-[10px] h-8">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight leading-[0.95]">
            {isNew ? "Create Product" : "Edit Product"}
          </h1>
          <p className="text-xs text-neutral-400 font-normal mt-0.5">
            {isNew
              ? "Add a new product to your store"
              : "Update product information"}
          </p>
        </div>
      </div>

      <ProductForm product={data} isNew={isNew} />
    </div>
  );
}
