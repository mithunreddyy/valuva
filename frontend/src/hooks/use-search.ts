import { useAppDispatch, useAppSelector } from "@/store";
import {
  setQuery,
  clearQuery,
  addToHistory,
  removeFromHistory,
  clearHistory,
  setSearching,
  setSearchResults,
  clearSearchResults,
} from "@/store/slices/searchSlice";
import { Product } from "@/types";
import { useCallback, useEffect } from "react";

/**
 * Hook for search functionality
 * Integrates with Redux store for search state management
 */
export function useSearch() {
  const dispatch = useAppDispatch();
  const { query, searchHistory, recentSearches, isSearching, searchResults } =
    useAppSelector((state) => state.search);

  // Set search query
  const updateQuery = useCallback(
    (newQuery: string) => {
      dispatch(setQuery(newQuery));
    },
    [dispatch]
  );

  // Clear search query
  const clearSearchQuery = useCallback(() => {
    dispatch(clearQuery());
  }, [dispatch]);

  // Add to search history
  const addSearchToHistory = useCallback(
    (searchQuery: string) => {
      if (searchQuery.trim()) {
        dispatch(addToHistory(searchQuery.trim()));
      }
    },
    [dispatch]
  );

  // Remove from history
  const removeSearchFromHistory = useCallback(
    (searchQuery: string) => {
      dispatch(removeFromHistory(searchQuery));
    },
    [dispatch]
  );

  // Clear all history
  const clearAllHistory = useCallback(() => {
    dispatch(clearHistory());
  }, [dispatch]);

  // Set searching state
  const setSearchingState = useCallback(
    (searching: boolean) => {
      dispatch(setSearching(searching));
    },
    [dispatch]
  );

  // Set search results
  const updateSearchResults = useCallback(
    (results: Product[]) => {
      dispatch(setSearchResults(results));
    },
    [dispatch]
  );

  // Clear search results
  const clearResults = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  // Perform search (combines query update and history)
  const performSearch = useCallback(
    (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        updateQuery(trimmedQuery);
        addSearchToHistory(trimmedQuery);
      }
    },
    [updateQuery, addSearchToHistory]
  );

  return {
    query,
    searchHistory,
    recentSearches,
    isSearching,
    searchResults,
    updateQuery,
    clearQuery: clearSearchQuery,
    addToHistory: addSearchToHistory,
    removeFromHistory: removeSearchFromHistory,
    clearHistory: clearAllHistory,
    setSearching: setSearchingState,
    setSearchResults: updateSearchResults,
    clearSearchResults: clearResults,
    performSearch,
  };
}

