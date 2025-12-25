"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-white grain-bg" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Timeless
            <br />
            <span className="text-neutral-600">Elegance</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-8">
            Discover curated collections that define modern sophistication
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              <Link href="/shop">Explore Collection</Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="/shop?isNewArrival=true">New Arrivals</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
