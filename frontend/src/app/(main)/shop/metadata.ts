import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Shop - Premium Minimal Fashion",
  description:
    "Browse our complete collection of premium minimal fashion. Discover timeless designs crafted for the modern minimalist.",
  url: `${process.env.NEXT_PUBLIC_APP_URL || "https://valuva.in"}/shop`,
  type: "website",
});
