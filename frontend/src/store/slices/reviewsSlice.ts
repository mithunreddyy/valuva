import { reviewsApi } from "@/services/api/reviews";
import type { Review } from "@/types";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Reviews slice state interface
 * Manages product reviews and ratings
 */
interface ReviewsState {
  reviews: Review[];
  currentReview: Review | null;
  productReviews: Record<string, Review[]>; // Keyed by productId
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  currentReview: null,
  productReviews: {},
  isLoading: false,
  error: null,
};

interface CreateReviewData {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
}

/**
 * Fetch reviews for a product
 */
export const fetchProductReviews = createAsyncThunk(
  "reviews/fetchProductReviews",
  async (
    { productId, params }: { productId: string; params?: { page?: number; limit?: number } },
    { rejectWithValue }
  ) => {
    try {
      const response = await reviewsApi.getProductReviews(productId, params);
      return { productId, reviews: response.data };
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch reviews"
      );
    }
  }
);

/**
 * Create a new review
 */
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (data: CreateReviewData, { rejectWithValue }) => {
    try {
      const response = await reviewsApi.createReview(data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to create review"
      );
    }
  }
);

/**
 * Update an existing review
 */
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async (
    { reviewId, data }: { reviewId: string; data: Partial<CreateReviewData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await reviewsApi.updateReview(reviewId, data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to update review"
      );
    }
  }
);

/**
 * Delete a review
 */
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await reviewsApi.deleteReview(reviewId);
      return reviewId;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to delete review"
      );
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setCurrentReview: (state, action: PayloadAction<Review | null>) => {
      state.currentReview = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearReviews: (state) => {
      state.reviews = [];
      state.productReviews = {};
      state.currentReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Product Reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productReviews[action.payload.productId] = action.payload.reviews;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        const productId = action.payload.productId;
        if (!state.productReviews[productId]) {
          state.productReviews[productId] = [];
        }
        state.productReviews[productId].push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        const productId = action.payload.productId;
        if (state.productReviews[productId]) {
          const index = state.productReviews[productId].findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) {
            state.productReviews[productId][index] = action.payload;
          }
        }
        if (state.currentReview?.id === action.payload.id) {
          state.currentReview = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove from all product reviews
        Object.keys(state.productReviews).forEach((productId) => {
          state.productReviews[productId] = state.productReviews[
            productId
          ].filter((r) => r.id !== action.payload);
        });
        if (state.currentReview?.id === action.payload) {
          state.currentReview = null;
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentReview, clearError, clearReviews } =
  reviewsSlice.actions;
export default reviewsSlice.reducer;

