"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/store";
import { removeFromComparison, clearComparison } from "@/store/slices/comparisonSlice";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatters";

export default function ComparePage() {
  const { products } = useAppSelector((state) => state.comparison);
  const dispatch = useAppDispatch();

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-neutral-400" />
          </div>
          <h1 className="text-3xl font-medium mb-2">No Products to Compare</h1>
          <p className="text-neutral-500 mb-6">
            Add products to comparison to see them side by side
          </p>
          <Link href="/shop">
            <Button variant="filled" className="rounded-[10px]">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12">
      <div className="container-luxury">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-medium">Compare Products</h1>
          <Button
            onClick={() => dispatch(clearComparison())}
            variant="outline"
            className="rounded-[10px]"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className="bg-white border border-[#e5e5e5] rounded-[20px] overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e5e5]">
                <th className="p-4 text-left font-medium">Product</th>
                {products.map((product) => (
                  <th key={product.id} className="p-4 text-left font-medium relative">
                    <button
                      onClick={() => dispatch(removeFromComparison(product.id))}
                      className="absolute top-2 right-2 p-1 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#e5e5e5]">
                <td className="p-4 font-medium">Image</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-[3/4] rounded-[12px] overflow-hidden bg-[#fafafa]">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </Link>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-[#e5e5e5]">
                <td className="p-4 font-medium">Name</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-[#e5e5e5]">
                <td className="p-4 font-medium">Price</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    {formatPrice(product.basePrice)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-[#e5e5e5]">
                <td className="p-4 font-medium">Category</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    {product.category?.name || "N/A"}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-[#e5e5e5]">
                <td className="p-4 font-medium">Brand</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    {product.brand || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium">Action</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <Button variant="filled" className="rounded-[10px] w-full">
                        View Product
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

