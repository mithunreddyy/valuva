import {
  addressesService,
  type AddressData,
} from "@/services/addresses.service";
import type { Address } from "@/types";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Addresses slice state interface
 * Manages user addresses for shipping and billing
 */
interface AddressesState {
  addresses: Address[];
  currentAddress: Address | null;
  defaultAddress: Address | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AddressesState = {
  addresses: [],
  currentAddress: null,
  defaultAddress: null,
  isLoading: false,
  error: null,
};

/**
 * Fetch all user addresses
 */
export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      return await addressesService.getAddresses();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch addresses"
      );
    }
  }
);

/**
 * Fetch address by ID
 */
export const fetchAddressById = createAsyncThunk(
  "addresses/fetchAddressById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await addressesService.getAddressById(id);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch address"
      );
    }
  }
);

/**
 * Create a new address
 */
export const createAddress = createAsyncThunk(
  "addresses/createAddress",
  async (data: AddressData, { rejectWithValue }) => {
    try {
      return await addressesService.createAddress(data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to create address"
      );
    }
  }
);

/**
 * Update an existing address
 */
export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async (
    { id, data }: { id: string; data: Partial<AddressData> },
    { rejectWithValue }
  ) => {
    try {
      return await addressesService.updateAddress(id, data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to update address"
      );
    }
  }
);

/**
 * Delete an address
 */
export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async (id: string, { rejectWithValue }) => {
    try {
      await addressesService.deleteAddress(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to delete address"
      );
    }
  }
);

const addressesSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    setCurrentAddress: (state, action: PayloadAction<Address | null>) => {
      state.currentAddress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAddresses: (state) => {
      state.addresses = [];
      state.currentAddress = null;
      state.defaultAddress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
        // Set default address if exists
        state.defaultAddress =
          action.payload.find((addr) => addr.isDefault) || null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Address By ID
      .addCase(fetchAddressById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddressById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAddress = action.payload;
      })
      .addCase(fetchAddressById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Address
      .addCase(createAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses.push(action.payload);
        if (action.payload.isDefault) {
          // Remove default flag from other addresses
          state.addresses.forEach((addr) => {
            if (addr.id !== action.payload.id) {
              addr.isDefault = false;
            }
          });
          state.defaultAddress = action.payload;
        }
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Address
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.addresses.findIndex(
          (addr) => addr.id === action.payload.id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        if (state.currentAddress?.id === action.payload.id) {
          state.currentAddress = action.payload;
        }
        if (action.payload.isDefault) {
          // Remove default flag from other addresses
          state.addresses.forEach((addr) => {
            if (addr.id !== action.payload.id) {
              addr.isDefault = false;
            }
          });
          state.defaultAddress = action.payload;
        } else if (state.defaultAddress?.id === action.payload.id) {
          state.defaultAddress = null;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Address
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.filter(
          (addr) => addr.id !== action.payload
        );
        if (state.currentAddress?.id === action.payload) {
          state.currentAddress = null;
        }
        if (state.defaultAddress?.id === action.payload) {
          state.defaultAddress = null;
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentAddress, clearError, clearAddresses } =
  addressesSlice.actions;
export default addressesSlice.reducer;

