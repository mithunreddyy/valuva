"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/shop");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="glass rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium mb-2">Price Range</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => updateFilters("minPrice", minPrice)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => updateFilters("maxPrice", maxPrice)}
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm font-medium mb-2">Size</label>
        <div className="grid grid-cols-4 gap-2">
          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
            <button
              key={size}
              onClick={() => updateFilters("size", size)}
              className={`border rounded py-2 text-sm hover:bg-black hover:text-white transition-colors ${
                searchParams.get("size") === size ? "bg-black text-white" : ""
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
