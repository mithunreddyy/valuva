import { generateProductMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    // Production-ready: Fail if API URL is not configured
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl && process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_API_URL environment variable is required in production"
      );
    }
    const apiUrlFinal = apiUrl || "http://localhost:5000";
    const response = await fetch(
      `${apiUrlFinal}/api/v1/products/slug/${params.slug}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (response.ok) {
      const data = await response.json();
      const product = data.data;

      if (product) {
        return generateProductMetadata({
          name: product.name,
          description: product.description || product.shortDescription,
          images: product.images || [],
          slug: product.slug,
          price: Number(product.basePrice),
          availability:
            product.totalStock > 0 ? "in stock" : "out of stock",
          category: product.category?.name,
        });
      }
    }
  } catch (error) {
    console.error("Failed to generate product metadata:", error);
  }

  // Fallback metadata
  return {
    title: "Product | Valuva",
    description: "Premium minimal fashion product",
  };
}

