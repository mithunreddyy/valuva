import type { ProductFilters } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  filters: ProductFilters;
  appliedFilters: ProductFilters;
  isFiltersApplied: boolean;
}

const initialState: FiltersState = {
  filters: {
    page: 1,
    limit: 12,
  },
  appliedFilters: {
    page: 1,
    limit: 12,
  },
  isFiltersApplied: false,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    /**
     * Set a filter value
     */
    setFilter: <K extends keyof ProductFilters>(
      state: FiltersState,
      action: PayloadAction<{
        key: K;
        value: ProductFilters[K];
      }>
    ) => {
      state.filters[action.payload.key] = action.payload
        .value as ProductFilters[K];
    },

    /**
     * Set multiple filters at once
     */
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    /**
     * Apply current filters (copy filters to appliedFilters)
     */
    applyFilters: (state) => {
      state.appliedFilters = { ...state.filters };
      state.isFiltersApplied = true;
    },

    /**
     * Reset filters to initial state
     */
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 12,
      };
      state.appliedFilters = {
        page: 1,
        limit: 12,
      };
      state.isFiltersApplied = false;
    },

    /**
     * Clear specific filter
     */
    clearFilter: (state, action: PayloadAction<keyof ProductFilters>) => {
      delete state.filters[action.payload];
      delete state.appliedFilters[action.payload];
      // Check if any filters are still applied
      const hasFilters = Object.keys(state.appliedFilters).some(
        (key) =>
          key !== "page" &&
          key !== "limit" &&
          state.appliedFilters[key as keyof ProductFilters] !== undefined
      );
      state.isFiltersApplied = hasFilters;
    },

    /**
     * Set page number
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
      state.appliedFilters.page = action.payload;
    },

    /**
     * Set limit (items per page)
     */
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = action.payload;
      state.appliedFilters.limit = action.payload;
      state.filters.page = 1; // Reset to first page when changing limit
      state.appliedFilters.page = 1;
    },

    /**
     * Set sort option
     */
    setSort: (
      state,
      action: PayloadAction<"price_asc" | "price_desc" | "newest" | "popular">
    ) => {
      state.filters.sort = action.payload;
      state.appliedFilters.sort = action.payload;
    },

    /**
     * Set price range
     */
    setPriceRange: (
      state,
      action: PayloadAction<{ min?: number; max?: number }>
    ) => {
      if (action.payload.min !== undefined) {
        state.filters.minPrice = action.payload.min;
        state.appliedFilters.minPrice = action.payload.min;
      }
      if (action.payload.max !== undefined) {
        state.filters.maxPrice = action.payload.max;
        state.appliedFilters.maxPrice = action.payload.max;
      }
    },

    /**
     * Set category filter
     */
    setCategory: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.categoryId = action.payload;
        state.appliedFilters.categoryId = action.payload;
      } else {
        delete state.filters.categoryId;
        delete state.appliedFilters.categoryId;
      }
    },

    /**
     * Set subcategory filter
     */
    setSubCategory: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.subCategoryId = action.payload;
        state.appliedFilters.subCategoryId = action.payload;
      } else {
        delete state.filters.subCategoryId;
        delete state.appliedFilters.subCategoryId;
      }
    },

    /**
     * Set search query
     */
    setSearchQuery: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.search = action.payload;
        state.appliedFilters.search = action.payload;
      } else {
        delete state.filters.search;
        delete state.appliedFilters.search;
      }
    },
  },
});

export const {
  setFilter,
  setFilters,
  applyFilters,
  resetFilters,
  clearFilter,
  setPage,
  setLimit,
  setSort,
  setPriceRange,
  setCategory,
  setSubCategory,
  setSearchQuery,
} = filtersSlice.actions;

export default filtersSlice.reducer;
