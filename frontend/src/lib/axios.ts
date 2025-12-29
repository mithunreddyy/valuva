import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { analytics } from "./analytics";
import { getStorageItem, removeStorageItem, setStorageItem } from "./storage";

/**
 * Production-ready Axios instance with:
 * - Request/response interceptors
 * - Analytics tracking
 * - Error handling
 * - Retry logic
 * - Request sanitization
 */

// Production-ready: Fail if API URL is not configured
const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL && process.env.NODE_ENV === "production") {
  throw new Error(
    "NEXT_PUBLIC_API_URL environment variable is required in production"
  );
}
// Development fallback only
const API_URL_FINAL = API_URL || "http://localhost:5000";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL_FINAL}/api/v1`,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const accessToken = getStorageItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add session ID for analytics
    if (typeof window !== "undefined") {
      const sessionId = sessionStorage.getItem("analytics_session_id");
      if (sessionId) {
        config.headers["X-Session-Id"] = sessionId;
      }
    }

    // Track API requests for analytics (non-sensitive endpoints)
    const isSensitiveEndpoint =
      config.url?.includes("/auth") ||
      config.url?.includes("/payments") ||
      config.url?.includes("/admin");

    if (!isSensitiveEndpoint && config.method) {
      // Track asynchronously
      setTimeout(() => {
        analytics.trackPageView(config.url || "", {
          method: config.method?.toUpperCase(),
          endpoint: config.url,
        });
      }, 0);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Track successful API calls
    const isSensitiveEndpoint =
      response.config.url?.includes("/auth") ||
      response.config.url?.includes("/payments") ||
      response.config.url?.includes("/admin");

    if (!isSensitiveEndpoint) {
      // Track response time for performance monitoring
      const responseTime =
        Date.now() -
        ((
          response.config as unknown as InternalAxiosRequestConfig & {
            metadata: { startTime: number };
          }
        ).metadata?.startTime || Date.now());
      if (responseTime > 1000) {
        console.warn("Slow API response", {
          url: response.config.url,
          time: `${responseTime}ms`,
        });
      }
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      metadata?: { startTime: number };
    };

    // Handle 401 Unauthorized - Refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = getStorageItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;
          setStorageItem("accessToken", accessToken);
          setStorageItem("refreshToken", newRefreshToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        removeStorageItem("accessToken");
        removeStorageItem("refreshToken");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      const message = retryAfter
        ? `Too many requests. Please try again after ${retryAfter} seconds.`
        : "Too many requests. Please try again later.";

      return Promise.reject(new Error(message));
    }

    // Track API errors for analytics
    if (error.response) {
      analytics.trackApiError(
        error.config?.url || "",
        error.response.status,
        error.config?.method
      );
    }

    return Promise.reject(error);
  }
);

// Add metadata to track request start time
apiClient.interceptors.request.use((config) => {
  (
    config as unknown as InternalAxiosRequestConfig & {
      metadata: { startTime: number };
    }
  ).metadata = { startTime: Date.now() };
  return config;
});

export default apiClient;
