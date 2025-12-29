import { adminApi } from "@/services/api/admin";
import { HomepageSection } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Admin Homepage slice state interface
 * Manages homepage sections for admin
 */
interface AdminHomepageState {
  sections: HomepageSection[];
  currentSection: HomepageSection | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminHomepageState = {
  sections: [],
  currentSection: null,
  isLoading: false,
  error: null,
};

export const fetchHomepageSections = createAsyncThunk(
  "adminHomepage/fetchSections",
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.getHomepageSections();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch homepage sections"
      );
    }
  }
);

export const createHomepageSection = createAsyncThunk(
  "adminHomepage/createSection",
  async (data: HomepageSection, { rejectWithValue }) => {
    try {
      return await adminApi.createHomepageSection(data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to create homepage section"
      );
    }
  }
);

export const updateHomepageSection = createAsyncThunk(
  "adminHomepage/updateSection",
  async (
    { id, data }: { id: string; data: HomepageSection },
    { rejectWithValue }
  ) => {
    try {
      return await adminApi.updateHomepageSection(id, data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to update homepage section"
      );
    }
  }
);

export const deleteHomepageSection = createAsyncThunk(
  "adminHomepage/deleteSection",
  async (id: string, { rejectWithValue }) => {
    try {
      await adminApi.deleteHomepageSection(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to delete homepage section"
      );
    }
  }
);

export const reorderHomepageSections = createAsyncThunk(
  "adminHomepage/reorderSections",
  async (
    sections: Array<{ id: string; sortOrder: number }>,
    { rejectWithValue }
  ) => {
    try {
      return await adminApi.reorderHomepageSections(sections);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to reorder homepage sections"
      );
    }
  }
);

const adminHomepageSlice = createSlice({
  name: "adminHomepage",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSection: (
      state,
      action: PayloadAction<HomepageSection | null>
    ) => {
      state.currentSection = action.payload;
    },
    clearCurrentSection: (state) => {
      state.currentSection = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepageSections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomepageSections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sections = action.payload.data;
      })
      .addCase(fetchHomepageSections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createHomepageSection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createHomepageSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sections.push(action.payload.data);
      })
      .addCase(createHomepageSection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateHomepageSection.fulfilled, (state, action) => {
        const index = state.sections.findIndex(
          (s) => s.id === action.payload.data.id
        );
        if (index !== -1) {
          state.sections[index] = action.payload.data;
        }
        if (state.currentSection?.id === action.payload.data.id) {
          state.currentSection = action.payload.data;
        }
      })
      .addCase(deleteHomepageSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter((s) => s.id !== action.payload);
        if (state.currentSection?.id === action.payload) {
          state.currentSection = null;
        }
      })
      .addCase(reorderHomepageSections.fulfilled, (state, action) => {
        state.sections = action.payload.data;
      });
  },
});

export const { clearError, setCurrentSection, clearCurrentSection } =
  adminHomepageSlice.actions;
export default adminHomepageSlice.reducer;
