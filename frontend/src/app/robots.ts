import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://valuva.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/checkout/",
          "/_next/",
          "/static/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

