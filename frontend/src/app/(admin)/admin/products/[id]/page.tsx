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
      <div className="min-h-screen bg-[#fafafa] py-6 sm:py-8">
        <div className="container-luxury">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-6 sm:py-8">
      <div className="container-luxury">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm" className="rounded-[8px] h-9">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-normal">
              {isNew ? "Create Product" : "Edit Product"}
            </h1>
            <p className="text-xs text-neutral-500 font-medium mt-1">
              {isNew
                ? "Add a new product to your store"
                : "Update product information"}
            </p>
          </div>
        </div>

        <ProductForm product={data} isNew={isNew} />
      </div>
    </div>
  );
}
