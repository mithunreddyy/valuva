"use client";

import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchProducts } from "@/hooks/use-products";
import { Search as SearchIcon, X, ArrowUpDown, TrendingUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { data, isLoading } = useSearchProducts(searchQuery);

  useEffect(() => {
    setQuery(initialQuery);
    setSearchQuery(initialQuery);
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent, searchTerm?: string) => {
    e.preventDefault();
    const term = searchTerm || query;
    if (!term.trim()) return;

    setSearchQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);

    // Save to recent searches
    if (term && !recentSearches.includes(term)) {
      const updated = [term, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  const handleClear = () => {
    setQuery("");
    setSearchQuery("");
    router.push("/search");
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    // Apply sorting logic here if needed
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Sort products based on selected option
  const sortedProducts = data?.data ? [...data.data] : [];
  if (sortBy === "price_asc") {
    sortedProducts.sort((a, b) => a.basePrice - b.basePrice);
  } else if (sortBy === "price_desc") {
    sortedProducts.sort((a, b) => b.basePrice - a.basePrice);
  } else if (sortBy === "newest") {
    sortedProducts.sort((a, b) => {
      const aDate = a.isNewArrival ? 1 : 0;
      const bDate = b.isNewArrival ? 1 : 0;
      return bDate - aDate;
    });
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-6 sm:py-8">
          <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal text-center text-[#0a0a0a]">
              Search
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <SearchIcon className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" />
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="pl-11 sm:pl-14 pr-24 sm:pr-28 h-12 sm:h-14 rounded-[16px] border border-[#e5e5e5] focus:border-[#0a0a0a] text-sm sm:text-base shadow-sm hover:shadow-md transition-all"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-20 sm:right-24 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-[#fafafa] transition-colors rounded-[12px]"
                  >
                    <X className="h-4 w-4 text-neutral-400" />
                  </button>
                )}
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 sm:h-10 px-4 sm:px-5 rounded-[12px] text-sm font-medium"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Recent Searches - Only show when no results */}
            {!searchQuery && recentSearches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-neutral-500" />
                    <span className="text-xs sm:text-sm font-medium text-neutral-500">
                      Recent Searches
                    </span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-neutral-400 hover:text-[#0a0a0a] font-medium transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        setQuery(search);
                        handleSearch(e, search);
                      }}
                      className="px-3 py-1.5 bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] rounded-[12px] text-xs sm:text-sm font-medium transition-all"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container-luxury py-6 sm:py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : searchQuery && data?.data ? (
          <div className="space-y-5 sm:space-y-6">
            {/* Results Header with Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-neutral-500 font-medium tracking-normal">
                {data.data.length}{" "}
                {data.data.length === 1 ? "result" : "results"} for &quot;
                <span className="text-[#0a0a0a] font-medium">{searchQuery}</span>&quot;
              </p>
              <div className="w-full sm:w-auto">
                <Select value={sortBy} onValueChange={handleSort}>
                  <SelectTrigger className="w-full sm:w-[180px] border border-[#e5e5e5] text-sm font-medium h-10 sm:h-11 hover:border-[#0a0a0a] transition-all rounded-[16px] bg-white shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-neutral-500" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="border border-[#e5e5e5] rounded-[16px] shadow-lg bg-white">
                    <SelectItem
                      value="relevance"
                      className="text-sm font-medium rounded-[12px] focus:bg-[#fafafa] py-2.5"
                    >
                      Relevance
                    </SelectItem>
                    <SelectItem
                      value="price_asc"
                      className="text-sm font-medium rounded-[12px] focus:bg-[#fafafa] py-2.5"
                    >
                      Price: Low to High
                    </SelectItem>
                    <SelectItem
                      value="price_desc"
                      className="text-sm font-medium rounded-[12px] focus:bg-[#fafafa] py-2.5"
                    >
                      Price: High to Low
                    </SelectItem>
                    <SelectItem
                      value="newest"
                      className="text-sm font-medium rounded-[12px] focus:bg-[#fafafa] py-2.5"
                    >
                      Newest First
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16 space-y-5">
                <div className="flex justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] bg-white border border-[#e5e5e5] flex items-center justify-center">
                    <SearchIcon className="h-10 w-10 sm:h-12 sm:w-12 text-neutral-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-normal text-[#0a0a0a]">
                    No products found
                  </h2>
                  <p className="text-sm text-neutral-500 font-medium">
                    Try searching with different keywords or browse all products
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => router.push("/shop")}
                  className="rounded-[16px]"
                >
                  Browse All Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 space-y-5">
            <div className="flex justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] bg-white border border-[#e5e5e5] flex items-center justify-center">
                <SearchIcon className="h-10 w-10 sm:h-12 sm:w-12 text-neutral-300" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-normal text-[#0a0a0a]">
                Start searching
              </h2>
              <p className="text-sm text-neutral-500 font-medium">
                Enter a search term to find products
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              <span className="text-xs text-neutral-400 font-medium">Try:</span>
              {["T-Shirts", "Jeans", "Dresses", "Accessories"].map((term) => (
                <button
                  key={term}
                  onClick={(e) => {
                    setQuery(term);
                    handleSearch(e, term);
                  }}
                  className="px-3 py-1.5 bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] rounded-[12px] text-xs font-medium transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
