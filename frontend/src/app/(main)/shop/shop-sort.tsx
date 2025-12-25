"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ShopSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select
      value={searchParams.get("sort") || ""}
      onChange={(e) => handleSort(e.target.value)}
      className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
    >
      <option value="">Sort by</option>
      <option value="newest">Newest</option>
      <option value="popular">Popular</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}
