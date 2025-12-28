"use client";

import { useCategories } from "@/hooks/use-categories";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CategoryShowcase() {
  const { data, isLoading } = useCategories();

  if (isLoading || !data?.data || data.data.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-luxury">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal">
                Shop by Category
              </h2>
              <p className="text-sm text-neutral-500 font-medium">
                Explore our curated collections
              </p>
            </div>
            <Link
              href="/shop"
              className="flex items-center gap-2 text-sm font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors group"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {data.data.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/shop?categoryId=${category.id}`}
                className="group relative aspect-[4/3] overflow-hidden bg-[#fafafa] border border-[#e5e5e5] rounded-[20px] hover:border-[#0a0a0a] transition-all hover:shadow-lg"
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#e5e5e5]">
                    <span className="text-sm font-medium text-neutral-400">
                      {category.name}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <h3 className="text-white text-xl lg:text-2xl font-medium tracking-normal mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-xs font-medium">
                    {category._count?.products ?? 0} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
