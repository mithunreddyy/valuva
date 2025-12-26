import type { ProductFilters } from "@/services/products.service";
import { productsService } from "@/services/products.service";
import type { Product } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ProductsState {
  items: Product[];
  currentProduct: Product | null;
  relatedProducts: Product[];
  searchResults: Product[];
  totalPages: number;
  currentPage: number;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  currentProduct: null,
  relatedProducts: [],
  searchResults: [],
  totalPages: 0,
  currentPage: 1,
  total: 0,
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters: ProductFilters, { rejectWithValue }) => {
    try {
      return await productsService.getProducts(filters);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await productsService.getProductById(id);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch product"
      );
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelatedProducts",
  async (id: string, { rejectWithValue }) => {
    try {
      return await productsService.getRelatedProducts(id);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch related products"
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (
    { query, limit }: { query: string; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      return await productsService.searchProducts(query, limit);
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "Search failed");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.relatedProducts = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.total = action.payload.meta.total;
        state.totalPages = action.payload.meta.totalPages;
        state.currentPage = action.payload.meta.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Related Products
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
      })
      // Search Products
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export const { clearCurrentProduct, clearSearchResults } =
  productsSlice.actions;
export default productsSlice.reducer;
