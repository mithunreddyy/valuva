import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./index";

/**
 * Store selectors
 * Reusable selectors for accessing Redux state
 * These help avoid repetitive code and provide type-safe state access
 * Using createSelector for memoization to prevent unnecessary re-renders
 */

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Products selectors
export const selectProducts = (state: RootState) => state.products;
export const selectProductsList = (state: RootState) => state.products.items;
export const selectCurrentProduct = (state: RootState) =>
  state.products.currentProduct;
export const selectRelatedProducts = (state: RootState) =>
  state.products.relatedProducts;
export const selectSearchResults = (state: RootState) =>
  state.products.searchResults;
export const selectProductsLoading = (state: RootState) =>
  state.products.isLoading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductsPagination = createSelector(
  [
    (state: RootState) => state.products.currentPage,
    (state: RootState) => state.products.totalPages,
    (state: RootState) => state.products.total,
  ],
  (page, totalPages, total) => ({ page, totalPages, total })
);

// Cart selectors
export const selectCart = (state: RootState) => state.cart;
export const selectCartData = (state: RootState) => state.cart.cart;
export const selectCartItems = (state: RootState) =>
  state.cart.cart?.items || [];
export const selectCartItemCount = (state: RootState) =>
  state.cart.cart?.itemCount || 0;
export const selectCartSubtotal = (state: RootState) =>
  state.cart.cart?.subtotal || 0;
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;

// Wishlist selectors
export const selectWishlist = (state: RootState) => state.wishlist;
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistCount = (state: RootState) =>
  state.wishlist.items.length;
export const selectWishlistLoading = (state: RootState) =>
  state.wishlist.isLoading;
export const selectWishlistError = (state: RootState) => state.wishlist.error;

// Orders selectors
export const selectOrders = (state: RootState) => state.orders;
export const selectOrdersList = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.isLoading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrdersPagination = createSelector(
  [
    (state: RootState) => state.orders.currentPage,
    (state: RootState) => state.orders.totalPages,
    (state: RootState) => state.orders.total,
  ],
  (page, totalPages, total) => ({ page, totalPages, total })
);

// Categories selectors
export const selectCategories = (state: RootState) => state.categories;
export const selectCategoriesList = (state: RootState) =>
  state.categories.categories;
export const selectCurrentCategory = (state: RootState) =>
  state.categories.currentCategory;
export const selectCategoriesLoading = (state: RootState) =>
  state.categories.isLoading;
export const selectCategoriesError = (state: RootState) =>
  state.categories.error;

// Addresses selectors
export const selectAddresses = (state: RootState) => state.addresses;
export const selectAddressesList = (state: RootState) =>
  state.addresses.addresses;
export const selectCurrentAddress = (state: RootState) =>
  state.addresses.currentAddress;
export const selectDefaultAddress = (state: RootState) =>
  state.addresses.defaultAddress;
export const selectAddressesLoading = (state: RootState) =>
  state.addresses.isLoading;
export const selectAddressesError = (state: RootState) => state.addresses.error;

// Reviews selectors
export const selectReviews = (state: RootState) => state.reviews;
export const selectProductReviews = (productId: string) => (state: RootState) =>
  state.reviews.productReviews[productId] || [];
export const selectCurrentReview = (state: RootState) =>
  state.reviews.currentReview;
export const selectReviewsLoading = (state: RootState) =>
  state.reviews.isLoading;
export const selectReviewsError = (state: RootState) => state.reviews.error;

// UI selectors
export const selectUI = (state: RootState) => state.ui;
export const selectIsSearchModalOpen = (state: RootState) =>
  state.ui.isSearchModalOpen;
export const selectIsMobileMenuOpen = (state: RootState) =>
  state.ui.isMobileMenuOpen;
export const selectIsFilterModalOpen = (state: RootState) =>
  state.ui.isFilterModalOpen;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectGlobalLoading = (state: RootState) => state.ui.globalLoading;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectIsSidebarOpen = (state: RootState) => state.ui.isSidebarOpen;

// Filters selectors
export const selectFilters = (state: RootState) => state.filters;
export const selectCurrentFilters = (state: RootState) => state.filters.filters;
export const selectAppliedFilters = (state: RootState) =>
  state.filters.appliedFilters;
export const selectIsFiltersApplied = (state: RootState) =>
  state.filters.isFiltersApplied;
