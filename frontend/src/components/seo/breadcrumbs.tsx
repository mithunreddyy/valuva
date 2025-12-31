"use client";

import { generateBreadcrumbStructuredData } from "@/lib/seo";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  name: string;
  url: string;
  isBold?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showMoreBy?: string; // For "More By [Brand]" at the end
}

export function Breadcrumbs({
  items,
  className = "",
  showMoreBy,
}: BreadcrumbsProps) {
  const pathname = usePathname();

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
        className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-neutral-600 ${className}`}
      >
        <ol className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isBold = item.isBold || isLast;
            const separator = isLast && showMoreBy ? ">" : "/";

            return (
              <li key={item.url} className="flex items-center gap-1.5 sm:gap-2">
                {isLast ? (
                  <>
                    <span
                      className={`text-neutral-600 ${
                        isBold ? "font-semibold" : "font-medium"
                      }`}
                      aria-current="page"
                    >
                      {item.name}
                    </span>
                    {showMoreBy && (
                      <>
                        <span className="text-neutral-600 font-medium">
                          {separator}
                        </span>
                        <span className="text-neutral-600 font-semibold">
                          More By {showMoreBy}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href={item.url}
                      className="text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
                    >
                      {item.name}
                    </Link>
                    <span className="text-neutral-400 font-medium">
                      {separator}
                    </span>
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
