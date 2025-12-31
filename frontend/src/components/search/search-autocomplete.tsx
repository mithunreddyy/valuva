"use client";

import { productsService } from "@/services";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Search, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SearchAutocompleteProps {
  query: string;
  onSelect: (query: string) => void;
  className?: string;
}

export function SearchAutocomplete({
  query,
  onSelect,

  className = "",
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch suggestions
  const { data: suggestions, isLoading } = useQuery<Product[]>({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        return [];
      }
      const result = await productsService.searchProducts(debouncedQuery, 5);
      return result || [];
    },
    enabled: debouncedQuery.length >= 2,
  });

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show suggestions when query changes
  useEffect(() => {
    if (query.length >= 2 && (suggestions?.length || 0) > 0) {
      setTimeout(() => {
        setIsOpen(true);
      }, 100);
    }
  }, [query, suggestions]);

  const handleSelect = (selectedQuery: string) => {
    onSelect(selectedQuery);
    setIsOpen(false);
  };

  const popularSearches = [
    "Shirts",
    "Pants",
    "Dresses",
    "Jackets",
    "Accessories",
  ];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e5e5e5] rounded-[20px] shadow-lg z-50 max-h-[500px] overflow-y-auto"
          >
            {/* Search Suggestions */}
            {suggestions && suggestions.length > 0 && (
              <div className="p-4 border-b border-[#e5e5e5]">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="h-4 w-4 text-neutral-500" />
                  <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Products
                  </h3>
                </div>
                <div className="space-y-1">
                  {suggestions.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => handleSelect(product.name)}
                      className="flex items-center gap-3 p-3 hover:bg-[#fafafa] rounded-[12px] transition-colors group"
                    >
                      <div className="relative w-12 h-12 rounded-[8px] overflow-hidden bg-[#fafafa] flex-shrink-0">
                        {product.images[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Search className="h-5 w-5 text-neutral-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0a0a0a] group-hover:text-[#0a0a0a] line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-neutral-500 font-medium">
                          {product.category?.name}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-[#0a0a0a]">
                        ₹{product.basePrice.toLocaleString()}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {(!suggestions || suggestions.length === 0) && !isLoading && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-neutral-500" />
                  <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Popular Searches
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSelect(search)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-600 bg-[#fafafa] hover:bg-[#0a0a0a] hover:text-[#fafafa] rounded-[12px] transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="p-4 text-center">
                <div className="inline-block w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* No Results */}
            {!isLoading &&
              (!suggestions || suggestions.length === 0) &&
              debouncedQuery.length >= 2 && (
                <div className="p-4 text-center">
                  <p className="text-sm text-neutral-500 font-medium">
                    No products found for &quot;{debouncedQuery}&quot;
                  </p>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
