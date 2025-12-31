"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProducts } from "@/hooks/use-admin";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { Package, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useAdminProducts({
    page,
    limit: 20,
    search: searchQuery || undefined,
  });

  const products = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 border-b border-[#e5e5e5] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-1 text-[#0a0a0a] leading-[0.95]">
            Products Management
          </h1>
          <p className="text-xs text-neutral-400 font-normal">
            Manage all products in your store
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button
            size="sm"
            variant="filled"
            className="rounded-[12px] gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#e5e5e5] p-3 rounded-[12px] mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]"
          />
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-[12px]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#e5e5e5] rounded-[16px]">
          <Package className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
          <p className="text-sm font-medium tracking-normal text-neutral-600">
            No products found
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-[#e5e5e5] rounded-[16px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fafafa] border-b border-[#e5e5e5]">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      SKU
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Stock
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: Product) => (
                    <tr
                      key={product.id}
                      className="border-b border-[#e5e5e5] hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] rounded-[10px] flex-shrink-0">
                            {product.images?.[0]?.url ? (
                              <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-5 w-5 text-neutral-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium tracking-normal">
                              {product.name}
                            </p>
                            <p className="text-xs text-neutral-500 font-normal">
                              {product.category?.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono text-neutral-600 font-normal">
                          {product.sku}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium">
                        {formatPrice(product.basePrice)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-medium ${
                            product.totalStock < 10
                              ? "text-red-600"
                              : product.totalStock < 50
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.totalStock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium tracking-normal rounded-[8px] ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-[10px] h-7 text-xs"
                          >
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
