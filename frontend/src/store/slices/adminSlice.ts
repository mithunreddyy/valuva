import { adminApi } from "@/services/api/admin";
import { adminMFAApi } from "@/services/api/admin-mfa";
import { Order, Product, User } from "@/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * Admin slice state interface
 * Manages admin dashboard, customers, analytics, security, and tracking state
 */
interface AdminState {
  // Dashboard
  dashboard: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    recentOrders: Order[];
    topProducts: Product[];
  } | null;
  isLoadingDashboard: boolean;

  // Customers
  customers: User[];
  currentCustomer: User | null;
  customersTotal: number;
  customersPage: number;
  customersTotalPages: number;
  isLoadingCustomers: boolean;

  // Analytics
  analytics: {
    salesMetrics: Record<string, unknown>;
    revenueTrends: Record<string, unknown>;
    topProducts: Product[];
  } | null;
  isLoadingAnalytics: boolean;
  analyticsDateRange: {
    startDate: string | null;
    endDate: string | null;
  };

  // Security (MFA)
  mfa: {
    isEnabled: boolean;
    isSetup: boolean;
    qrCode: string | null;
    backupCodes: string[];
    otpAuthUrl: string | null;
  };
  isLoadingMFA: boolean;

  // Tracking
  activeOrders: Order[];
  isLoadingTracking: boolean;

  // Error state
  error: string | null;
}

const initialState: AdminState = {
  dashboard: null,
  isLoadingDashboard: false,
  customers: [],
  currentCustomer: null,
  customersTotal: 0,
  customersPage: 1,
  customersTotalPages: 0,
  isLoadingCustomers: false,
  analytics: null,
  isLoadingAnalytics: false,
  analyticsDateRange: {
    startDate: null,
    endDate: null,
  },
  mfa: {
    isEnabled: false,
    isSetup: false,
    qrCode: null,
    backupCodes: [],
    otpAuthUrl: null,
  },
  isLoadingMFA: false,
  activeOrders: [],
  isLoadingTracking: false,
  error: null,
};

// Dashboard
export const fetchDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.getDashboard();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch dashboard data"
      );
    }
  }
);

// Customers
export const fetchCustomers = createAsyncThunk(
  "admin/fetchCustomers",
  async (
    params: { page?: number; limit?: number; search?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getUsers(params);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch customers"
      );
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  "admin/fetchCustomerById",
  async (id: string, { rejectWithValue }) => {
    try {
      // Note: getUserById might not exist, using getUsers with filter
      const response = await adminApi.getUsers({ search: id });
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch customer"
      );
    }
  }
);

// Analytics
export const fetchAnalytics = createAsyncThunk(
  "admin/fetchAnalytics",
  async (
    params: { startDate?: string; endDate?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const [salesMetrics, revenueTrends, topProducts] = await Promise.all([
        adminApi.getAnalytics(params),
        adminApi.getRevenueTrends(params),
        adminApi.getTopProducts(params),
      ]);

      return {
        salesMetrics: salesMetrics.data,
        revenueTrends: revenueTrends.data,
        topProducts: topProducts.data,
      };
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch analytics"
      );
    }
  }
);

// MFA
export const setupMFA = createAsyncThunk(
  "admin/setupMFA",
  async (_, { rejectWithValue }) => {
    try {
      return await adminMFAApi.setupMFA();
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "Failed to setup MFA");
    }
  }
);

export const verifyAndEnableMFA = createAsyncThunk(
  "admin/verifyAndEnableMFA",
  async (
    data: { token: string; secret: string; backupCodes: string[] },
    { rejectWithValue }
  ) => {
    try {
      await adminMFAApi.verifyAndEnableMFA(data);
      return data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to enable MFA"
      );
    }
  }
);

export const disableMFA = createAsyncThunk(
  "admin/disableMFA",
  async (password: string, { rejectWithValue }) => {
    try {
      await adminMFAApi.disableMFA(password);
      return undefined;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to disable MFA"
      );
    }
  }
);

export const regenerateBackupCodes = createAsyncThunk(
  "admin/regenerateBackupCodes",
  async (_, { rejectWithValue }) => {
    try {
      return await adminMFAApi.regenerateBackupCodes();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to regenerate backup codes"
      );
    }
  }
);

// Tracking
export const fetchActiveOrders = createAsyncThunk(
  "admin/fetchActiveOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.getActiveOrders();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch active orders"
      );
    }
  }
);

export const updateOrderTracking = createAsyncThunk(
  "admin/updateOrderTracking",
  async (
    data: {
      orderId: string;
      status: string;
      location: string;
      description: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await adminApi.updateOrderTracking(
        data.orderId,
        data.status,
        data.location,
        data.description
      );
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to update order tracking"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
    setAnalyticsDateRange: (
      state,
      action: PayloadAction<{
        startDate: string | null;
        endDate: string | null;
      }>
    ) => {
      state.analyticsDateRange = action.payload;
    },
    clearMFASetup: (state) => {
      state.mfa.qrCode = null;
      state.mfa.otpAuthUrl = null;
      state.mfa.backupCodes = [];
      state.mfa.isSetup = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoadingDashboard = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoadingDashboard = false;
        state.dashboard = action.payload.data;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoadingDashboard = false;
        state.error = action.payload as string;
      })
      // Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoadingCustomers = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoadingCustomers = false;
        state.customers = action.payload.data;
        state.customersTotal = action.payload.meta.total;
        state.customersPage = action.payload.meta.page;
        state.customersTotalPages = action.payload.meta.totalPages;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoadingCustomers = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.currentCustomer = action.payload.data;
      })
      // Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoadingAnalytics = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoadingAnalytics = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoadingAnalytics = false;
        state.error = action.payload as string;
      })
      // MFA
      .addCase(setupMFA.pending, (state) => {
        state.isLoadingMFA = true;
        state.error = null;
      })
      .addCase(setupMFA.fulfilled, (state, action) => {
        state.isLoadingMFA = false;
        state.mfa.qrCode = action.payload.qrCode;
        state.mfa.otpAuthUrl = action.payload.otpAuthUrl;
        state.mfa.backupCodes = action.payload.backupCodes;
        state.mfa.isSetup = true;
      })
      .addCase(setupMFA.rejected, (state, action) => {
        state.isLoadingMFA = false;
        state.error = action.payload as string;
      })
      .addCase(verifyAndEnableMFA.fulfilled, (state) => {
        state.mfa.isEnabled = true;
        state.mfa.isSetup = false;
      })
      .addCase(disableMFA.fulfilled, (state) => {
        state.mfa.isEnabled = false;
        state.mfa.backupCodes = [];
      })
      .addCase(regenerateBackupCodes.fulfilled, (state, action) => {
        state.mfa.backupCodes = action.payload.backupCodes;
      })
      // Tracking
      .addCase(fetchActiveOrders.pending, (state) => {
        state.isLoadingTracking = true;
        state.error = null;
      })
      .addCase(fetchActiveOrders.fulfilled, (state, action) => {
        state.isLoadingTracking = false;
        state.activeOrders = action.payload.data;
      })
      .addCase(fetchActiveOrders.rejected, (state, action) => {
        state.isLoadingTracking = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderTracking.fulfilled, (state) => {
        // Refresh active orders after update
        state.isLoadingTracking = true;
      });
  },
});

export const {
  clearError,
  clearCurrentCustomer,
  setAnalyticsDateRange,
  clearMFASetup,
} = adminSlice.actions;
export default adminSlice.reducer;
