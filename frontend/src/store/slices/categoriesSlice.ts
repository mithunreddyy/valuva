import type { Category } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.error = null;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      const existingIndex = state.categories.findIndex(
        (cat) => cat.id === action.payload.id
      );
      if (existingIndex !== -1) {
        state.categories[existingIndex] = action.payload;
      } else {
        state.categories.push(action.payload);
      }
    },
    setCurrentCategory: (state, action: PayloadAction<Category | null>) => {
      state.currentCategory = action.payload;
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(
        (cat) => cat.id === action.payload.id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      if (state.currentCategory?.id === action.payload.id) {
        state.currentCategory = action.payload;
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(
        (cat) => cat.id !== action.payload
      );
      if (state.currentCategory?.id === action.payload) {
        state.currentCategory = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.currentCategory = null;
    },
  },
});

export const {
  setCategories,
  addCategory,
  setCurrentCategory,
  updateCategory,
  removeCategory,
  setLoading,
  setError,
  clearCategories,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
