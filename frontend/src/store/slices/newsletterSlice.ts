import { newsletterApi } from "@/services/api/newsletter";
import { NewsletterSubscriptionData } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * Newsletter slice state interface
 * Manages newsletter subscriptions
 */
interface NewsletterState {
  isSubscribed: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: NewsletterState = {
  isSubscribed: false,
  isSubmitting: false,
  error: null,
};

export const subscribeNewsletter = createAsyncThunk(
  "newsletter/subscribe",
  async ({ email }: NewsletterSubscriptionData, { rejectWithValue }) => {
    try {
      await newsletterApi.subscribe({ email });
      return email;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to subscribe to newsletter"
      );
    }
  }
);

export const unsubscribeNewsletter = createAsyncThunk(
  "newsletter/unsubscribe",
  async (
    { email, token }: NewsletterSubscriptionData & Partial<{ token: string }>,
    { rejectWithValue }
  ) => {
    try {
      await newsletterApi.unsubscribe(email, token);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to unsubscribe from newsletter"
      );
    }
  }
);

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSubscription: (state) => {
      state.isSubscribed = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSubscribed = true;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      .addCase(unsubscribeNewsletter.fulfilled, (state) => {
        state.isSubscribed = false;
      });
  },
});

export const { clearError, resetSubscription } = newsletterSlice.actions;
export default newsletterSlice.reducer;
