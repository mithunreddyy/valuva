import { CreateOrderData, ordersService } from "@/services/orders.service";
import { Order } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  totalPages: number;
  currentPage: number;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  totalPages: 0,
  currentPage: 1,
  total: 0,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (data: CreateOrderData, { rejectWithValue }) => {
    try {
      return await ordersService.createOrder(data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to create order"
      );
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (
    { page, limit }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      return await ordersService.getOrders(page, limit);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch orders"
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await ordersService.getOrderById(id);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch order"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.data;
        state.total = action.payload.meta.total;
        state.totalPages = action.payload.meta.totalPages;
        state.currentPage = action.payload.meta.page;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  },
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
