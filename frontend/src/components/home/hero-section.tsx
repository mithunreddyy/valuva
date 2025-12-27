"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full min-h-[75vh] sm:min-h-[80vh] flex items-center justify-center relative overflow-hidden bg-[#fafafa]">
      <div className="container-luxury py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <p className="text-sm font-medium tracking-normal text-neutral-500">
            SS/2024
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight">
            VALUVA
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Minimal luxury clothing with timeless design. Crafted for the modern
            minimalist.
          </p>
          <div className="pt-2">
            <Link href="/shop" className="btn-luxury inline-block">
              Shop Collection
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
