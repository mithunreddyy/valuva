import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
}

export function generateMetadata({
  title = "Valuva - Premium Minimal Fashion",
  description = "Minimal luxury clothing with timeless design. Crafted for the modern minimalist.",
  image = "/og-image.jpg",
  url = "https://valuva.in",
  type = "website" as const,
  noIndex = false,
}: SEOProps = {}): Metadata {
  const fullTitle = title.includes("Valuva") ? title : `${title} | Valuva`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    openGraph: {
      type: type === "product" ? "website" : type || "website",
      title: fullTitle,
      description,
      url,
      siteName: "Valuva",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export function generateProductMetadata(product: {
  name: string;
  description: string;
  images: Array<{ url: string }>;
  slug: string;
  price: number;
}) {
  const url = `https://valuva.com/products/${product.slug}`;
  const image = product.images[0]?.url || "/og-image.jpg";

  return generateMetadata({
    title: product.name,
    description: product.description,
    image,
    url,
    type: "product",
  });
}
