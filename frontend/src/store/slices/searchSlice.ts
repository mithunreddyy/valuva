import { Product } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Search slice state interface
 * Manages search state and history
 */
interface SavedSearch {
  id: string;
  query: string;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    brand?: string;
    size?: string;
    color?: string;
  };
  createdAt: number;
}

interface SearchState {
  query: string;
  searchHistory: string[];
  recentSearches: string[];
  savedSearches: SavedSearch[];
  isSearching: boolean;
  searchResults: Product[];
}

const initialState: SearchState = {
  query: "",
  searchHistory: [],
  recentSearches: [],
  savedSearches: [],
  isSearching: false,
  searchResults: [],
};

const MAX_HISTORY = 10;
const MAX_RECENT = 5;

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearQuery: (state) => {
      state.query = "";
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (!query) return;

      // Remove if already exists
      state.searchHistory = state.searchHistory.filter((q) => q !== query);
      // Add to beginning
      state.searchHistory.unshift(query);
      // Keep only last MAX_HISTORY items
      state.searchHistory = state.searchHistory.slice(0, MAX_HISTORY);

      // Update recent searches
      state.recentSearches = state.searchHistory.slice(0, MAX_RECENT);
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(
        (q) => q !== action.payload
      );
      state.recentSearches = state.recentSearches.filter(
        (q) => q !== action.payload
      );
    },
    clearHistory: (state) => {
      state.searchHistory = [];
      state.recentSearches = [];
    },
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Product[]>) => {
      state.searchResults = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    saveSearch: (
      state,
      action: PayloadAction<{
        query: string;
        filters?: {
          minPrice?: number;
          maxPrice?: number;
          minRating?: number;
          brand?: string;
          size?: string;
          color?: string;
        };
      }>
    ) => {
      const savedSearch: SavedSearch = {
        id: Date.now().toString(),
        query: action.payload.query,
        filters: action.payload.filters,
        createdAt: Date.now(),
      };
      // Remove if already exists (by query and filters)
      state.savedSearches = state.savedSearches.filter(
        (s) =>
          s.query !== savedSearch.query ||
          JSON.stringify(s.filters) !== JSON.stringify(savedSearch.filters)
      );
      // Add to beginning
      state.savedSearches.unshift(savedSearch);
      // Keep only last 20 saved searches
      state.savedSearches = state.savedSearches.slice(0, 20);
    },
    removeSavedSearch: (state, action: PayloadAction<string>) => {
      state.savedSearches = state.savedSearches.filter(
        (s) => s.id !== action.payload
      );
    },
    clearSavedSearches: (state) => {
      state.savedSearches = [];
    },
  },
});

export const {
  setQuery,
  clearQuery,
  addToHistory,
  removeFromHistory,
  clearHistory,
  setSearching,
  setSearchResults,
  clearSearchResults,
  saveSearch,
  removeSavedSearch,
  clearSavedSearches,
} = searchSlice.actions;
export type { SavedSearch };
export default searchSlice.reducer;
