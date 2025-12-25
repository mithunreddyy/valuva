"use client";

import apiClient from "@/lib/axios";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function CategoryShowcase() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get("/categories");
      return response.data.data;
    },
  });

  if (isLoading || !data) return null;

  return (
    <section className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Shop by Category</h2>
        <p className="text-neutral-600 mt-2">Explore our curated collections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.slice(0, 6).map((category: Category, index: number) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Link
              href={`/shop?categoryId=${category.id}`}
              className="group block relative aspect-[4/3] rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-white text-2xl font-bold">
                  {category.name}
                </h3>
                <p className="text-white/90 text-sm mt-1">
                  {category.productsCount} products
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
