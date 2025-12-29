"use client";

import { generateStructuredData } from "@/lib/seo";

interface StructuredDataProps {
  type: "Product" | "Article" | "Organization" | "BreadcrumbList";
  data: {
    name?: string;
    description?: string;
    image?: string;
    url?: string;
    price?: number;
    currency?: string;
    availability?: string;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    category?: string;
  };
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = generateStructuredData({ type, ...data });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

