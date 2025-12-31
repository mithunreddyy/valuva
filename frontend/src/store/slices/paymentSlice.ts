import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Payment slice state interface
 * Manages payment/Razorpay state
 */
interface PaymentState {
  // Razorpay
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  isProcessing: boolean;
  paymentStatus: "idle" | "processing" | "success" | "failed";
  error: string | null;

  // Payment method
  selectedPaymentMethod: string | null;
}

const initialState: PaymentState = {
  razorpayOrderId: null,
  razorpayPaymentId: null,
  isProcessing: false,
  paymentStatus: "idle",
  error: null,
  selectedPaymentMethod: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setRazorpayOrderId: (state, action: PayloadAction<string>) => {
      state.razorpayOrderId = action.payload;
    },
    setRazorpayPaymentId: (state, action: PayloadAction<string>) => {
      state.razorpayPaymentId = action.payload;
    },
    setPaymentProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
      if (action.payload) {
        state.paymentStatus = "processing";
      }
    },
    setPaymentSuccess: (state) => {
      state.paymentStatus = "success";
      state.isProcessing = false;
      state.error = null;
    },
    setPaymentFailed: (state, action: PayloadAction<string>) => {
      state.paymentStatus = "failed";
      state.isProcessing = false;
      state.error = action.payload;
    },
    setSelectedPaymentMethod: (state, action: PayloadAction<string>) => {
      state.selectedPaymentMethod = action.payload;
    },
    resetPayment: (state) => {
      state.razorpayOrderId = null;
      state.razorpayPaymentId = null;
      state.isProcessing = false;
      state.paymentStatus = "idle";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setRazorpayOrderId,
  setRazorpayPaymentId,
  setPaymentProcessing,
  setPaymentSuccess,
  setPaymentFailed,
  setSelectedPaymentMethod,
  resetPayment,
  clearError,
} = paymentSlice.actions;
export default paymentSlice.reducer;
