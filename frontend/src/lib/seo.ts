import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  tags?: string[];
  price?: number;
  currency?: string;
  availability?: "in stock" | "out of stock" | "preorder";
}

interface BreadcrumbItem {
  name: string;
  url: string;
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
  availability?: "in stock" | "out of stock" | "preorder";
  category?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://valuva.in";
  const url = `${baseUrl}/products/${product.slug}`;
  const image = product.images[0]?.url || "/og-image.jpg";

  return generateMetadata({
    title: product.name,
    description: product.description,
    image,
    url,
    type: "product",
    price: product.price,
    currency: "INR",
    availability: product.availability || "in stock",
    category: product.category,
  });
}

/**
 * Generate structured data (JSON-LD) for SEO
 */
export function generateStructuredData({
  type,
  name,
  description,
  image,
  url,
  price,
  currency = "INR",
  availability,
  publishedTime,
  modifiedTime,
  author,
  category,
}: {
  type: "Product" | "Article" | "Organization" | "BreadcrumbList";
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
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://valuva.in";
  const base = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case "Product":
      return {
        ...base,
        "@type": "Product",
        name,
        description,
        image: image ? [image] : undefined,
        url,
        offers: price
          ? {
              "@type": "Offer",
              price,
              priceCurrency: currency,
              availability: availability
                ? `https://schema.org/${availability.replace(" ", "")}`
                : "https://schema.org/InStock",
            }
          : undefined,
        category,
      };

    case "Article":
      return {
        ...base,
        "@type": "Article",
        headline: name,
        description,
        image: image ? [image] : undefined,
        url,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        author: author
          ? {
              "@type": "Person",
              name: author,
            }
          : undefined,
        publisher: {
          "@type": "Organization",
          name: "Valuva",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/valuvaLogo.png`,
          },
        },
      };

    case "Organization":
      return {
        ...base,
        "@type": "Organization",
        name: "Valuva",
        url: baseUrl,
        logo: `${baseUrl}/valuvaLogo.png`,
        description:
          "Premium minimal fashion with timeless design. Crafted for the modern minimalist.",
        sameAs: [
          "https://www.facebook.com/valuva",
          "https://www.instagram.com/valuva",
          "https://twitter.com/valuva",
        ],
      };

    case "BreadcrumbList":
      return {
        ...base,
        "@type": "BreadcrumbList",
        itemListElement: [],
      };

    default:
      return base;
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  items: BreadcrumbItem[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate product structured data with reviews
 */
export function generateProductStructuredDataWithReviews(product: {
  name: string;
  description: string;
  images: Array<{ url: string }>;
  slug: string;
  price: number;
  availability?: string;
  category?: string;
  averageRating?: number;
  reviewCount?: number;
  brand?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://valuva.in";
  const url = `${baseUrl}/products/${product.slug}`;
  const image = product.images[0]?.url || "/og-image.jpg";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    url,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : {
          "@type": "Brand",
          name: "Valuva",
        },
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability:
        product.availability === "in stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
    },
    aggregateRating:
      product.averageRating && product.reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };
}
