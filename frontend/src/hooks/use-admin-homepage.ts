import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchHomepageSections,
  createHomepageSection,
  updateHomepageSection,
  deleteHomepageSection,
  reorderHomepageSections,
  setCurrentSection,
  clearCurrentSection,
  clearError,
} from "@/store/slices/adminHomepageSlice";
import { HomepageSection } from "@/types";
import { useCallback, useEffect } from "react";
import { toast } from "./use-toast";

/**
 * Hook for admin homepage sections management
 * Integrates with Redux store for state management
 */
export function useAdminHomepage() {
  const dispatch = useAppDispatch();
  const { sections, currentSection, isLoading, error } = useAppSelector(
    (state) => state.adminHomepage
  );

  // Fetch all sections
  const loadSections = useCallback(() => {
    dispatch(fetchHomepageSections());
  }, [dispatch]);

  // Create new section
  const createSection = useCallback(
    async (data: HomepageSection) => {
      try {
        const result = await dispatch(createHomepageSection(data)).unwrap();
        toast({
          title: "Section created",
          description: "Homepage section created successfully.",
        });
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create section";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw err;
      }
    },
    [dispatch]
  );

  // Update section
  const updateSection = useCallback(
    async (id: string, data: HomepageSection) => {
      try {
        const result = await dispatch(
          updateHomepageSection({ id, data })
        ).unwrap();
        toast({
          title: "Section updated",
          description: "Homepage section updated successfully.",
        });
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update section";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw err;
      }
    },
    [dispatch]
  );

  // Delete section
  const deleteSection = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteHomepageSection(id)).unwrap();
        toast({
          title: "Section deleted",
          description: "Homepage section deleted successfully.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete section";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw err;
      }
    },
    [dispatch]
  );

  // Reorder sections
  const reorderSections = useCallback(
    async (sections: Array<{ id: string; sortOrder: number }>) => {
      try {
        await dispatch(reorderHomepageSections(sections)).unwrap();
        toast({
          title: "Sections reordered",
          description: "Homepage sections reordered successfully.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to reorder sections";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw err;
      }
    },
    [dispatch]
  );

  // Set current section
  const selectSection = useCallback(
    (section: HomepageSection | null) => {
      dispatch(setCurrentSection(section));
    },
    [dispatch]
  );

  // Clear current section
  const clearSelection = useCallback(() => {
    dispatch(clearCurrentSection());
  }, [dispatch]);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-load sections on mount
  useEffect(() => {
    loadSections();
  }, [loadSections]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      handleClearError();
    }
  }, [error, handleClearError]);

  return {
    sections,
    currentSection,
    isLoading,
    error,
    loadSections,
    createSection,
    updateSection,
    deleteSection,
    reorderSections,
    selectSection,
    clearSelection,
    clearError: handleClearError,
  };
}

