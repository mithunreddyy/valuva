import { returnsApi, ReturnRequest } from "@/services/api/returns";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Returns slice state interface
 * Manages return requests
 */
interface ReturnsState {
  returns: ReturnRequest[];
  currentReturn: ReturnRequest | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReturnsState = {
  returns: [],
  currentReturn: null,
  isLoading: false,
  error: null,
};

export const createReturnRequest = createAsyncThunk(
  "returns/createReturn",
  async (
    data: {
      orderId: string;
      orderItemIds: string[];
      reason: string;
      description?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await returnsApi.createReturn(data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to create return request"
      );
    }
  }
);

export const fetchUserReturns = createAsyncThunk(
  "returns/fetchUserReturns",
  async (_, { rejectWithValue }) => {
    try {
      return await returnsApi.getUserReturns();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch return requests"
      );
    }
  }
);

const returnsSlice = createSlice({
  name: "returns",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReturn: (state) => {
      state.currentReturn = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReturnRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReturnRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.returns.unshift(action.payload);
        state.currentReturn = action.payload;
      })
      .addCase(createReturnRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserReturns.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserReturns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.returns = action.payload;
      })
      .addCase(fetchUserReturns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentReturn } = returnsSlice.actions;
export default returnsSlice.reducer;

