import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "@/lib/storage";
import { authService } from "@/services/auth.service";
import { AuthResponse, LoginData, RegisterData, User } from "@/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initialize state safely for SSR
const getInitialState = (): AuthState => {
  const accessToken = getStorageItem("accessToken");
  return {
    user: null,
    accessToken,
    refreshToken: getStorageItem("refreshToken"),
    isAuthenticated: !!accessToken,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      setStorageItem("accessToken", response.accessToken);
      setStorageItem("refreshToken", response.refreshToken);
      return response;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      setStorageItem("accessToken", response.accessToken);
      setStorageItem("refreshToken", response.refreshToken);
      return response;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "Logout failed");
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getProfile();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      return await authService.updateProfile(data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "Failed to update profile"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      setStorageItem("accessToken", action.payload.accessToken);
      setStorageItem("refreshToken", action.payload.refreshToken);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        removeStorageItem("accessToken");
        removeStorageItem("refreshToken");
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      // Get Profile
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
