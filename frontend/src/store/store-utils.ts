import type { RootState } from "./index";

/**
 * Store utility functions
 * Helper functions for working with Redux store
 */

/**
 * Check if user is authenticated
 * @param state - Root state
 * @returns true if user is authenticated
 */
export const isAuthenticated = (state: RootState): boolean => {
  return state.auth.isAuthenticated && !!state.auth.user;
};

/**
 * Check if cart is empty
 * @param state - Root state
 * @returns true if cart is empty
 */
export const isCartEmpty = (state: RootState): boolean => {
  return !state.cart.cart || state.cart.cart.itemCount === 0;
};

/**
 * Check if wishlist is empty
 * @param state - Root state
 * @returns true if wishlist is empty
 */
export const isWishlistEmpty = (state: RootState): boolean => {
  return state.wishlist.items.length === 0;
};

/**
 * Get cart total formatted as currency
 * @param state - Root state
 * @returns Formatted cart total string
 */
export const getCartTotalFormatted = (state: RootState): string => {
  const total = state.cart.cart?.subtotal || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(total);
};

/**
 * Check if product is in wishlist
 * @param state - Root state
 * @param productId - Product ID to check
 * @returns true if product is in wishlist
 */
export const isProductInWishlist = (
  state: RootState,
  productId: string
): boolean => {
  return state.wishlist.items.some((item) => item.productId === productId);
};

/**
 * Get product by ID from products list
 * @param state - Root state
 * @param productId - Product ID
 * @returns Product or undefined
 */
export const getProductById = (
  state: RootState,
  productId: string
): RootState["products"]["items"][0] | undefined => {
  return state.products.items.find((product) => product.id === productId);
};

/**
 * Get category by slug
 * @param state - Root state
 * @param slug - Category slug
 * @returns Category or undefined
 */
export const getCategoryBySlug = (
  state: RootState,
  slug: string
): RootState["categories"]["categories"][0] | undefined => {
  return state.categories.categories.find((category) => category.slug === slug);
};

/**
 * Get default address or first address
 * @param state - Root state
 * @returns Address or undefined
 */
export const getDefaultOrFirstAddress = (
  state: RootState
): RootState["addresses"]["addresses"][0] | undefined => {
  if (state.addresses.defaultAddress) {
    return state.addresses.defaultAddress;
  }
  return state.addresses.addresses[0];
};

/**
 * Check if any async operation is loading
 * @param state - Root state
 * @returns true if any slice is loading
 */
export const isAnyLoading = (state: RootState): boolean => {
  return (
    state.auth.isLoading ||
    state.products.isLoading ||
    state.cart.isLoading ||
    state.wishlist.isLoading ||
    state.orders.isLoading ||
    state.categories.isLoading ||
    state.addresses.isLoading ||
    state.reviews.isLoading ||
    state.ui.globalLoading
  );
};

/**
 * Get error message from any slice
 * @param state - Root state
 * @returns First error message found or null
 */
export const getAnyError = (state: RootState): string | null => {
  return (
    state.auth.error ||
    state.products.error ||
    state.cart.error ||
    state.wishlist.error ||
    state.orders.error ||
    state.categories.error ||
    state.addresses.error ||
    state.reviews.error ||
    null
  );
};

/**
 * Clear all errors from all slices
 * This is a helper function that should be used with dispatch
 * Note: This returns action creators, not the actual actions
 */
export const clearAllErrors = () => {
  return {
    auth: { type: "auth/clearError" },
    products: { type: "products/clearError" },
    cart: { type: "cart/clearError" },
    wishlist: { type: "wishlist/clearError" },
    orders: { type: "orders/clearError" },
    categories: { type: "categories/clearError" },
    addresses: { type: "addresses/clearError" },
    reviews: { type: "reviews/clearError" },
  };
};

