"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { AdvancedFilters } from "@/components/search/advanced-filters";
import { SearchAutocomplete } from "@/components/search/search-autocomplete";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalytics } from "@/hooks/use-analytics";
import { useSearchProducts } from "@/hooks/use-products";
import { useSearch } from "@/hooks/use-search";
import { InputSanitizer } from "@/lib/input-sanitizer";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  Filter,
  Search as SearchIcon,
  TrendingUp,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const analytics = useAnalytics();
  const initialQuery = searchParams.get("q") || "";

  // Use search hook for state management
  const {
    query,
    recentSearches,
    updateQuery,
    performSearch,
    clearQuery,
    clearHistory,
  } = useSearch();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    brand?: string;
    size?: string;
    color?: string;
  }>({});

  // Sync with URL params
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      updateQuery(initialQuery);
      setSearchQuery(initialQuery);
    }
  }, [initialQuery, query, updateQuery]);

  const { data, isLoading } = useSearchProducts(searchQuery);

  // Sync query state with URL params when they change
  useEffect(() => {
    if (initialQuery !== query) {
      updateQuery(initialQuery);
      setSearchQuery(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent, searchTerm?: string) => {
    e.preventDefault();
    const rawTerm = searchTerm || query;
    if (!rawTerm.trim()) return;

    // Sanitize search query
    const term = InputSanitizer.sanitizeSearchQuery(rawTerm);
    if (!term) return;

    // Use search hook to update state and history
    performSearch(term);
    setSearchQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);

    // Track search analytics
    analytics.trackSearch(term, data?.data?.length || 0);
  };

  const handleClear = () => {
    clearQuery();
    setSearchQuery("");
    router.push("/search");
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    // Track filter/sort analytics
    analytics.trackFilterApplied({ sort: value });
  };

  const clearRecentSearches = () => {
    clearHistory();
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
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Search", url: "/search", isBold: true },
          ]}
        />
      </div>

      {/* Header */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-center text-[#0a0a0a] leading-[0.95]"
            >
              Search
            </motion.h1>

            {/* Search Form */}
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 z-10" />
                  <Input
                    type="text"
                    value={query}
                    onChange={(e) => updateQuery(e.target.value)}
                    placeholder="Search products, brands, categories..."
                    className="pl-11 pr-24 h-11 rounded-[12px] border border-[#e5e5e5] focus:border-[#0a0a0a] bg-white text-sm font-normal"
                    autoFocus
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-20 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center hover:bg-[#f5f5f5] transition-colors rounded-[8px] z-10"
                    >
                      <X className="h-3.5 w-3.5 text-neutral-400" />
                    </button>
                  )}
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 rounded-[10px] text-xs font-normal z-10"
                  >
                    Search
                  </Button>
                </div>
              </form>
              <SearchAutocomplete
                query={query}
                onSelect={(selectedQuery) => {
                  updateQuery(selectedQuery);
                  handleSearch(
                    { preventDefault: () => {} } as React.FormEvent,
                    selectedQuery
                  );
                }}
                className="w-full"
              />
            </div>

            {/* Recent Searches - Only show when no results */}
            {!searchQuery && recentSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-2.5 pt-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="text-xs font-normal text-neutral-400">
                      Recent Searches
                    </span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-neutral-400 hover:text-[#0a0a0a] font-normal transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      onClick={(e) => {
                        updateQuery(search);
                        handleSearch(e, search);
                      }}
                      className="px-3 py-1.5 bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] rounded-[10px] text-xs font-normal transition-all"
                    >
                      {search}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container-luxury py-6 sm:py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : searchQuery && data?.data ? (
          <div className="space-y-4">
            {/* Results Header with Sort and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5"
            >
              <p className="text-xs text-neutral-400 font-normal">
                {data.data.length}{" "}
                {data.data.length === 1 ? "result" : "results"} for &quot;
                <span className="text-[#0a0a0a] font-normal">
                  {searchQuery}
                </span>
                &quot;
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsFiltersOpen(true)}
                  className="gap-1.5 border-[#e5e5e5] hover:border-[#0a0a0a] bg-white rounded-[12px]"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                  {Object.keys(appliedFilters).length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#0a0a0a] text-white text-[10px] font-normal flex items-center justify-center">
                      {Object.keys(appliedFilters).length}
                    </span>
                  )}
                </Button>
                <Select value={sortBy} onValueChange={handleSort}>
                  <SelectTrigger className="w-full sm:w-[160px] border border-[#e5e5e5] text-xs font-normal h-9 hover:border-[#0a0a0a] transition-all rounded-[12px] bg-white">
                    <div className="flex items-center gap-1.5">
                      <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="border border-[#e5e5e5] rounded-[12px] shadow-lg bg-white">
                    <SelectItem
                      value="relevance"
                      className="text-xs font-normal rounded-[10px] focus:bg-[#fafafa] py-2"
                    >
                      Relevance
                    </SelectItem>
                    <SelectItem
                      value="price_asc"
                      className="text-xs font-normal rounded-[10px] focus:bg-[#fafafa] py-2"
                    >
                      Price: Low to High
                    </SelectItem>
                    <SelectItem
                      value="price_desc"
                      className="text-xs font-normal rounded-[10px] focus:bg-[#fafafa] py-2"
                    >
                      Price: High to Low
                    </SelectItem>
                    <SelectItem
                      value="newest"
                      className="text-xs font-normal rounded-[10px] focus:bg-[#fafafa] py-2"
                    >
                      Newest First
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Advanced Filters Modal */}
            <AdvancedFilters
              isOpen={isFiltersOpen}
              onClose={() => setIsFiltersOpen(false)}
              filters={appliedFilters}
              onApply={(filters) => {
                setAppliedFilters(filters);
                // Apply filters to search - you can extend this to filter the results
                analytics.trackFilterApplied(filters);
              }}
              onReset={() => {
                setAppliedFilters({});
              }}
            />

            {sortedProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12 sm:py-16 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto"
                >
                  <SearchIcon className="h-5 w-5 text-neutral-400" />
                </motion.div>
                <div className="space-y-1.5">
                  <h2 className="text-base font-normal tracking-normal text-[#0a0a0a]">
                    No products found
                  </h2>
                  <p className="text-xs text-neutral-400 font-normal">
                    Try searching with different keywords
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
              >
                <AnimatePresence>
                  {sortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{
                        delay: index * 0.03,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center py-20 sm:py-24 space-y-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto"
            >
              <SearchIcon className="h-7 w-7 text-neutral-400" />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-base font-normal tracking-normal text-[#0a0a0a]">
                Start searching
              </h2>
              <p className="text-xs text-neutral-400 font-normal">
                Enter a search term to find products
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <span className="text-xs text-neutral-400 font-normal">Try:</span>
              {["T-Shirts", "Jeans", "Dresses", "Accessories"].map((term) => (
                <button
                  key={term}
                  onClick={(e) => {
                    updateQuery(term);
                    handleSearch(e, term);
                  }}
                  className="px-2.5 py-1 bg-[#f5f5f5] border border-transparent hover:border-[#e5e5e5] hover:bg-white rounded-[10px] text-xs font-normal transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
