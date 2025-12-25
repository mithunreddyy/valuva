"use client";

import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { ProductCard } from "@/components/products/products-card";
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
    <div className="relative z-10 container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Search Products</h1>

        <form onSubmit={handleSearch} className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="pl-12 pr-20 h-14 text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-20 top-1/2 -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            Search
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : searchQuery && data?.data ? (
        <div>
          <p className="text-neutral-600 mb-6">
            {data.data.length} result{data.data.length !== 1 ? "s" : ""} for
            &quot;
            {searchQuery}&quot;
          </p>

          {data.data.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
              <h2 className="text-2xl font-bold mb-2">No products found</h2>
              <p className="text-neutral-600 mb-6">
                Try searching with different keywords
              </p>
              <Button onClick={() => router.push("/shop")}>
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
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
          <h2 className="text-2xl font-bold mb-2">Start searching</h2>
          <p className="text-neutral-600">
            Enter a search term to find products
          </p>
        </div>
      )}
    </div>
  );
}
