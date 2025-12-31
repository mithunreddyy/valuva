import { cartService } from "@/services/cart.service";
import type { Cart } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
  isOpen: false,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { variantId, quantity }: { variantId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      return await cartService.addToCart({ variantId, quantity });
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to add item to cart"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      return await cartService.updateCartItem(itemId, { quantity });
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to update cart item"
      );
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId: string, { rejectWithValue }) => {
    try {
      return await cartService.removeCartItem(itemId);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to remove cart item"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.clearCart();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.isOpen = true;
      })
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      // Remove Cart Item
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { toggleCart, openCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;
