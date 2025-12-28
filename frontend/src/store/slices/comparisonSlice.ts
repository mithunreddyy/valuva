import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";

interface ComparisonState {
  products: Product[];
}

const initialState: ComparisonState = {
  products: [],
};

const comparisonSlice = createSlice({
  name: "comparison",
  initialState,
  reducers: {
    addToComparison: (state, action: PayloadAction<Product>) => {
      if (state.products.length >= 4) {
        // Limit to 4 products
        return;
      }
      if (!state.products.find((p) => p.id === action.payload.id)) {
        state.products.push(action.payload);
      }
    },
    removeFromComparison: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    clearComparison: (state) => {
      state.products = [];
    },
  },
});

export const { addToComparison, removeFromComparison, clearComparison } =
  comparisonSlice.actions;

export default comparisonSlice.reducer;

