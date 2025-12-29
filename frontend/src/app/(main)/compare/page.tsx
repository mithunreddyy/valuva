"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearComparison,
  removeFromComparison,
} from "@/store/slices/comparisonSlice";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ComparePage() {
  const { products } = useAppSelector((state) => state.comparison);
  const dispatch = useAppDispatch();

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4 sm:mb-6"
          >
            <X className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-300" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2 mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a]">
              No Products to Compare
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              Add products to comparison to see them side by side
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/shop">
              <Button
                size="lg"
                variant="filled"
                className="rounded-[16px] gap-2"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a] mb-1">
                Compare Products
              </h1>
              <p className="text-sm text-neutral-500 font-medium">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} to compare
              </p>
            </div>
            <Button
              onClick={() => dispatch(clearComparison())}
              variant="outline"
              size="lg"
              className="rounded-[16px] gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="container-luxury py-6 sm:py-8 lg:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-[#e5e5e5] rounded-[20px] overflow-x-auto shadow-sm"
        >
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                <th className="p-4 sm:p-6 text-left text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a]">
                  Product
                </th>
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.th
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 sm:p-6 text-left text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] relative min-w-[200px]"
                    >
                      <button
                        onClick={() =>
                          dispatch(removeFromComparison(product.id))
                        }
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center hover:bg-white rounded-[12px] transition-colors text-neutral-400 hover:text-[#0a0a0a]"
                        aria-label="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.th>
                  ))}
                </AnimatePresence>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#e5e5e5]">
                <td className="p-4 sm:p-6 text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a]">
                  Image
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 sm:p-6">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <div className="relative aspect-[3/4] rounded-[16px] overflow-hidden bg-[#fafafa] border border-[#e5e5e5]">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-neutral-400">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-[#e5e5e5]">
                <td className="p-4 sm:p-6 text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a]">
                  Name
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 sm:p-6">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] hover:opacity-70 transition-opacity"
                    >
                      {product.name}
                    </Link>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-[#e5e5e5]">
                <td className="p-4 sm:p-6 text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a]">
                  Price
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 sm:p-6">
                    <span className="text-sm sm:text-base font-medium text-[#0a0a0a]">
                      {formatPrice(product.basePrice)}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-[#e5e5e5]">
                <td className="p-4 sm:p-6 text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a]">
                  Category
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 sm:p-6">
                    <span className="text-sm text-neutral-600 font-medium">
                      {product.category?.name || "N/A"}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-[#e5e5e5]">
                <td className="p-4 sm:p-6 text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a]">
                  Brand
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 sm:p-6">
                    <span className="text-sm text-neutral-600 font-medium">
                      {product.brand || "N/A"}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-6 text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a]">
                  Action
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 sm:p-6">
                    <Link href={`/products/${product.slug}`}>
                      <Button
                        variant="filled"
                        size="sm"
                        className="rounded-[12px] w-full gap-2"
                      >
                        View Product
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </section>
    </div>
  );
}
