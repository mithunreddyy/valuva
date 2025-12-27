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
    <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12 lg:py-16">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-[#e5e5e5] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal mb-3">
              Products Management
            </h1>
            <p className="text-sm text-neutral-500 font-medium tracking-normal">
              Manage all products in your store
            </p>
          </div>
          <Link href="/admin/products/new">
            <Button size="lg" className="rounded-[10px]">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px] mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-[10px]"
            />
          </div>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#e5e5e5] rounded-[12px]">
            <Package className="h-16 w-16 mx-auto mb-6 text-neutral-300" />
            <p className="text-base font-medium tracking-normal text-neutral-600">
              No products found
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white border border-[#e5e5e5] rounded-[12px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#fafafa] border-b border-[#e5e5e5]">
                    <tr>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
                        Product
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
                        SKU
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
                        Price
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
                        Stock
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
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
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] rounded-[8px]">
                              {product.images?.[0]?.url ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-neutral-300" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium tracking-normal">
                                {product.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {product.category?.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-mono text-neutral-600">
                            {product.sku}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium">
                          {formatPrice(product.basePrice)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-sm font-medium ${
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
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 text-xs font-medium tracking-normal rounded-[6px] ${
                              product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-xs font-medium text-[#0a0a0a] hover:underline"
                          >
                            Edit
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
              <div className="mt-6 flex justify-center">
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
    </div>
  );
}
