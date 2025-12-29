"use client";

import Link from "next/link";

export function SkipToContent() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0a0a0a] focus:text-[#fafafa] focus:rounded-[12px] focus:font-medium focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2"
    >
      Skip to main content
    </Link>
  );
}
