"use client";

import { generateBreadcrumbStructuredData } from "@/lib/seo";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://valuva.in";

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbItems: BreadcrumbItem[] =
    items ||
    (() => {
      const paths = pathname.split("/").filter(Boolean);
      const generated: BreadcrumbItem[] = [
        { name: "Home", url: "/" },
        ...paths.map((path, index) => {
          const url = "/" + paths.slice(0, index + 1).join("/");
          const name =
            path.charAt(0).toUpperCase() +
            path.slice(1).replace(/-/g, " ").replace(/\//g, "");
          return { name, url };
        }),
      ];
      return generated;
    })();

  const structuredData = generateBreadcrumbStructuredData(breadcrumbItems);

  return (
    <>
      <StructuredDataScript data={structuredData} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-sm font-medium ${className}`}
      >
        <ol className="flex items-center gap-2 flex-wrap">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            return (
              <li key={item.url} className="flex items-center gap-2">
                {index === 0 ? (
                  <Link
                    href={item.url}
                    className="flex items-center gap-1 text-neutral-500 hover:text-[#0a0a0a] transition-colors"
                    aria-label="Home"
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span className="sr-only">Home</span>
                  </Link>
                ) : (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                    {isLast ? (
                      <span className="text-[#0a0a0a]" aria-current="page">
                        {item.name}
                      </span>
                    ) : (
                      <Link
                        href={item.url}
                        className="text-neutral-500 hover:text-[#0a0a0a] transition-colors"
                      >
                        {item.name}
                      </Link>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

function StructuredDataScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
