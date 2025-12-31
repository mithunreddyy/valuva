import { wishlistService } from "@/services/wishlist.service";
import { AddToWishlistData, WishlistItem } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}

const wishlistInitialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await wishlistService.getWishlist();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch wishlist"
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (data: AddToWishlistData, { rejectWithValue }) => {
    try {
      return await wishlistService.addToWishlist(data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to add to wishlist"
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (data: AddToWishlistData, { rejectWithValue }) => {
    try {
      return await wishlistService.removeFromWishlist(data.productId);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to remove from wishlist"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: wishlistInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
