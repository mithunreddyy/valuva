"use client";

import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchProducts } from "@/hooks/use-products";
import { Search as SearchIcon, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const { data, isLoading } = useSearchProducts(searchQuery);

  useEffect(() => {
    setQuery(initialQuery);
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleClear = () => {
    setQuery("");
    setSearchQuery("");
    router.push("/search");
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-normal text-center">
              Search
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-12 pr-24 h-14 rounded-[10px]"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-24 top-1/2 -translate-y-1/2 p-2 hover:opacity-70 transition-opacity rounded-[8px]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[10px]"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container-luxury py-8 sm:py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : searchQuery && data?.data ? (
          <div className="space-y-6">
            <p className="text-sm text-neutral-500 font-medium tracking-normal text-center">
              {data.data.length} {data.data.length === 1 ? "result" : "results"} for &quot;{searchQuery}&quot;
            </p>

            {data.data.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <SearchIcon className="h-16 w-16 mx-auto text-neutral-300" />
                <h2 className="text-2xl sm:text-3xl font-medium tracking-normal">
                  No products found
                </h2>
                <p className="text-sm text-neutral-500 font-medium">
                  Try searching with different keywords
                </p>
                <Button size="lg" onClick={() => router.push("/shop")}>
                  Browse All Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <SearchIcon className="h-16 w-16 mx-auto text-neutral-300" />
            <h2 className="text-2xl sm:text-3xl font-medium tracking-normal">
              Start searching
            </h2>
            <p className="text-sm text-neutral-500 font-medium">
              Enter a search term to find products
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
