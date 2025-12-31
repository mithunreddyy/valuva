/**
 * React Query Configuration
 * Optimized caching and memory management
 */

export const QUERY_KEYS = {
  products: ["products"] as const,
  product: (id: string) => ["product", id] as const,
  relatedProducts: (id: string) => ["related-products", id] as const,
  searchProducts: (query: string) => ["search-products", query] as const,
  orders: ["orders"] as const,
  order: (id: string) => ["order", id] as const,
  cart: ["cart"] as const,
  wishlist: ["wishlist"] as const,
  addresses: ["addresses"] as const,
  categories: ["categories"] as const,
  reviews: (productId: string) => ["reviews", productId] as const,
  personalizedRecommendations: ["personalized-recommendations"] as const,
} as const;

/**
 * Cache time configurations (in milliseconds)
 * - Short: 5 minutes (frequently changing data)
 * - Medium: 15 minutes (moderately changing data)
 * - Long: 30 minutes (rarely changing data)
 * - Very Long: 1 hour (static data)
 */
export const CACHE_TIME = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 15 * 60 * 1000, // 15 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Stale time configurations (in milliseconds)
 * - Short: 1 minute (frequently changing data)
 * - Medium: 5 minutes (moderately changing data)
 * - Long: 15 minutes (rarely changing data)
 * - Very Long: 30 minutes (static data)
 */
export const STALE_TIME = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
  VERY_LONG: 30 * 60 * 1000, // 30 minutes
} as const;

/**
 * Default query options for different data types
 */
export const DEFAULT_QUERY_OPTIONS = {
  // Products - medium cache, short stale (frequently viewed)
  products: {
    staleTime: STALE_TIME.SHORT,
    gcTime: CACHE_TIME.MEDIUM, // Previously cacheTime
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  },
  // Orders - long cache, medium stale (rarely changes after creation)
  orders: {
    staleTime: STALE_TIME.MEDIUM,
    gcTime: CACHE_TIME.LONG,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
  // Cart - short cache, short stale (changes frequently)
  cart: {
    staleTime: STALE_TIME.SHORT,
    gcTime: CACHE_TIME.SHORT,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },
  // Categories - very long cache, very long stale (rarely changes)
  categories: {
    staleTime: STALE_TIME.VERY_LONG,
    gcTime: CACHE_TIME.VERY_LONG,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
  // Addresses - medium cache, medium stale
  addresses: {
    staleTime: STALE_TIME.MEDIUM,
    gcTime: CACHE_TIME.MEDIUM,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
  // Wishlist - medium cache, short stale
  wishlist: {
    staleTime: STALE_TIME.SHORT,
    gcTime: CACHE_TIME.MEDIUM,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
} as const;

