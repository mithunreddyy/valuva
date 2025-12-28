"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-[120px] sm:text-[160px] md:text-[200px] font-light tracking-tight text-[#0a0a0a] leading-none">
            404
          </h1>
          <div className="w-16 h-1 bg-[#0a0a0a] mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a]">
            Page Not Found
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-medium max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-[16px] border-[#e5e5e5] hover:border-[#0a0a0a] transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="filled"
              className="w-full sm:w-auto rounded-[16px]"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/shop" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-[16px] border-[#e5e5e5] hover:border-[#0a0a0a] transition-all"
            >
              <Search className="h-4 w-4 mr-2" />
              Browse Shop
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-[#e5e5e5]">
          <p className="text-xs text-neutral-500 font-medium mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="text-xs text-neutral-600 hover:text-[#0a0a0a] font-medium transition-colors"
            >
              Shop
            </Link>
            <span className="text-xs text-neutral-300">•</span>
            <Link
              href="/about"
              className="text-xs text-neutral-600 hover:text-[#0a0a0a] font-medium transition-colors"
            >
              About
            </Link>
            <span className="text-xs text-neutral-300">•</span>
            <Link
              href="/contact"
              className="text-xs text-neutral-600 hover:text-[#0a0a0a] font-medium transition-colors"
            >
              Contact
            </Link>
            <span className="text-xs text-neutral-300">•</span>
            <Link
              href="/support"
              className="text-xs text-neutral-600 hover:text-[#0a0a0a] font-medium transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
