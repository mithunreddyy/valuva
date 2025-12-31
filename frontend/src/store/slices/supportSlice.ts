import { supportApi } from "@/services/api/support";
import { CreateTicketReplyData, SupportTicket } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * Support slice state interface
 * Manages support tickets and replies
 */
interface SupportState {
  tickets: SupportTicket[];
  currentTicket: SupportTicket | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SupportState = {
  tickets: [],
  currentTicket: null,
  isLoading: false,
  error: null,
};

export const createTicket = createAsyncThunk(
  "support/createTicket",
  async (
    data: { subject: string; message: string; category: string },
    { rejectWithValue }
  ) => {
    try {
      return await supportApi.createTicket(data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to create support ticket"
      );
    }
  }
);

export const fetchUserTickets = createAsyncThunk(
  "support/fetchUserTickets",
  async (_, { rejectWithValue }) => {
    try {
      return await supportApi.getUserTickets();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch support tickets"
      );
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  "support/fetchTicketById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await supportApi.getTicketById(id);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch support ticket"
      );
    }
  }
);

export const addTicketReply = createAsyncThunk(
  "support/addTicketReply",
  async (
    { ticketId, ...data }: { ticketId: string } & CreateTicketReplyData,
    { rejectWithValue }
  ) => {
    try {
      return await supportApi.addReply(ticketId, data);
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "Failed to add reply");
    }
  }
);

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets.unshift(action.payload);
        state.currentTicket = action.payload;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchUserTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.currentTicket = action.payload;
      })
      .addCase(addTicketReply.fulfilled, (state, action) => {
        if (state.currentTicket) {
          state.currentTicket.replies = state.currentTicket.replies || [];
          state.currentTicket.replies.push(action.payload);
        }
      });
  },
});

export const { clearError, clearCurrentTicket } = supportSlice.actions;
export default supportSlice.reducer;
