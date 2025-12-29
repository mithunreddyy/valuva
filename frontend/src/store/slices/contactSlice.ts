import { contactApi, ContactFormData } from "@/services/api/contact";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * Contact slice state interface
 * Manages contact form submissions
 */
interface ContactState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: ContactState = {
  isSubmitting: false,
  isSuccess: false,
  error: null,
};

export const submitContactForm = createAsyncThunk(
  "contact/submitForm",
  async (data: ContactFormData, { rejectWithValue }) => {
    try {
      return await contactApi.submitContact(data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to submit contact form"
      );
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSuccess = true;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
        state.isSuccess = false;
      });
  },
});

export const { clearError, resetSuccess } = contactSlice.actions;
export default contactSlice.reducer;

