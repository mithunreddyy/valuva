import { Product } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Search slice state interface
 * Manages search state and history
 */
interface SearchState {
  query: string;
  searchHistory: string[];
  recentSearches: string[];
  isSearching: boolean;
  searchResults: Product[];
}

const initialState: SearchState = {
  query: "",
  searchHistory: [],
  recentSearches: [],
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
} = searchSlice.actions;
export default searchSlice.reducer;
