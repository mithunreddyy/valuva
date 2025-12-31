"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearComparison,
  removeFromComparison,
} from "@/store/slices/comparisonSlice";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Grid3x3, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ComparePage() {
  const { products } = useAppSelector((state) => state.comparison);
  const dispatch = useAppDispatch();

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
          <Breadcrumbs
            items={[
              { name: "Home", url: "/" },
              { name: "Compare", url: "/compare", isBold: true },
            ]}
          />
        </div>

        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto"
            >
              <Grid3x3 className="h-5 w-5 text-neutral-400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-1.5"
            >
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#0a0a0a]">
                No Products to Compare
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                Add products to comparison to see them side by side
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/shop" className="inline-block">
                <Button
                  size="sm"
                  variant="filled"
                  className="gap-1.5 rounded-[12px]"
                >
                  Browse Products
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Compare", url: "/compare", isBold: true },
          ]}
        />
      </div>

      {/* Header */}
      <section className="border-b border-[#f5f5f5] bg-white">
        <div className="container-luxury py-6 sm:py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4"
          >
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]">
                Compare Products
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} to compare
              </p>
            </div>
            <Button
              onClick={() => dispatch(clearComparison())}
              variant="outline"
              size="sm"
              className="rounded-[12px] gap-1.5 border-[#e5e5e5] hover:border-[#0a0a0a] bg-white"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="container-luxury py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-[#e5e5e5] rounded-[16px] overflow-hidden"
        >
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                  <th className="p-4 text-left text-xs font-medium tracking-normal text-[#0a0a0a] sticky left-0 bg-[#fafafa] z-10">
                    Product
                  </th>
                  <AnimatePresence>
                    {products.map((product, index) => (
                      <motion.th
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 text-left text-xs font-medium tracking-normal text-[#0a0a0a] relative min-w-[200px]"
                      >
                        <button
                          onClick={() =>
                            dispatch(removeFromComparison(product.id))
                          }
                          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center hover:bg-[#f5f5f5] rounded-[8px] transition-colors text-neutral-400 hover:text-[#0a0a0a]"
                          aria-label="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.th>
                    ))}
                  </AnimatePresence>
                </tr>
              </thead>
              <tbody>
                {/* Image Row */}
                <tr className="border-b border-[#e5e5e5]">
                  <td className="p-4 text-xs font-medium tracking-normal text-[#0a0a0a] sticky left-0 bg-white z-10">
                    Image
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block hover:opacity-80 transition-opacity group"
                      >
                        <div className="relative aspect-[3/4] rounded-[12px] overflow-hidden bg-[#fafafa] border border-[#e5e5e5] group-hover:border-[#0a0a0a] transition-colors">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-neutral-300" />
                            </div>
                          )}
                        </div>
                      </Link>
                    </td>
                  ))}
                </tr>

                {/* Name Row */}
                <tr className="border-b border-[#e5e5e5]">
                  <td className="p-4 text-xs font-medium tracking-normal text-[#0a0a0a] sticky left-0 bg-white z-10">
                    Name
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm font-normal tracking-normal text-[#0a0a0a] hover:opacity-70 transition-opacity block"
                      >
                        {product.name}
                      </Link>
                    </td>
                  ))}
                </tr>

                {/* Price Row */}
                <tr className="border-b border-[#e5e5e5]">
                  <td className="p-4 text-xs font-medium tracking-normal text-[#0a0a0a] sticky left-0 bg-white z-10">
                    Price
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4">
                      <span className="text-sm font-normal text-[#0a0a0a]">
                        {formatPrice(product.basePrice)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-neutral-400 line-through ml-2">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Category Row */}
                <tr className="border-b border-[#e5e5e5]">
                  <td className="p-4 text-xs font-medium tracking-normal text-[#0a0a0a] sticky left-0 bg-white z-10">
                    Category
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4">
                      <span className="text-xs text-neutral-600 font-normal">
                        {product.category?.name || "N/A"}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Brand Row */}
                {products.some((p) => p.brand) && (
                  <tr className="border-b border-[#e5e5e5]">
                    <td className="p-4 text-xs font-medium tracking-normal text-[#0a0a0a] sticky left-0 bg-white z-10">
                      Brand
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4">
                        <span className="text-xs text-neutral-600 font-normal">
                          {product.brand || "N/A"}
                        </span>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Action Row */}
                <tr>
                  <td className="p-4 text-xs font-medium tracking-normal text-[#0a0a0a] sticky left-0 bg-white z-10">
                    Action
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4">
                      <Link href={`/products/${product.slug}`}>
                        <Button
                          variant="filled"
                          size="sm"
                          className="rounded-[12px] w-full gap-1.5"
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
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-[#e5e5e5]">
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.98 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] flex-shrink-0 rounded-[12px] mb-2">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-neutral-300" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-normal tracking-normal text-[#0a0a0a] mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm font-normal text-[#0a0a0a] mb-1">
                        {formatPrice(product.basePrice)}
                      </p>
                      {product.category && (
                        <p className="text-xs text-neutral-400 font-normal">
                          {product.category.name}
                        </p>
                      )}
                    </Link>
                    <button
                      onClick={() => dispatch(removeFromComparison(product.id))}
                      className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-all rounded-[8px] flex-shrink-0"
                      aria-label="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Link href={`/products/${product.slug}`}>
                    <Button
                      variant="filled"
                      size="sm"
                      className="rounded-[12px] w-full gap-1.5"
                    >
                      View Product
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
