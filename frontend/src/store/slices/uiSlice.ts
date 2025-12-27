import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * UI slice state interface
 * Manages global UI state like modals, notifications, theme, etc.
 */
interface UIState {
  // Modal states
  isSearchModalOpen: boolean;
  isMobileMenuOpen: boolean;
  isFilterModalOpen: boolean;

  // Notification state
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number;
  }>;

  // Loading states
  globalLoading: boolean;

  // Theme
  theme: "light" | "dark" | "system";

  // Sidebar state
  isSidebarOpen: boolean;
}

const initialState: UIState = {
  isSearchModalOpen: false,
  isMobileMenuOpen: false,
  isFilterModalOpen: false,
  notifications: [],
  globalLoading: false,
  theme: "light",
  isSidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Search Modal
    openSearchModal: (state) => {
      state.isSearchModalOpen = true;
    },
    closeSearchModal: (state) => {
      state.isSearchModalOpen = false;
    },
    toggleSearchModal: (state) => {
      state.isSearchModalOpen = !state.isSearchModalOpen;
    },

    // Mobile Menu
    openMobileMenu: (state) => {
      state.isMobileMenuOpen = true;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },

    // Filter Modal
    openFilterModal: (state) => {
      state.isFilterModalOpen = true;
    },
    closeFilterModal: (state) => {
      state.isFilterModalOpen = false;
    },
    toggleFilterModal: (state) => {
      state.isFilterModalOpen = !state.isFilterModalOpen;
    },

    // Notifications
    addNotification: (
      state,
      action: PayloadAction<{
        type: "success" | "error" | "warning" | "info";
        message: string;
        duration?: number;
      }>
    ) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        duration: action.payload.duration || 5000,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Global Loading
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },

    // Theme
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },

    // Sidebar
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    // Reset UI state
    resetUI: (state) => {
      state.isSearchModalOpen = false;
      state.isMobileMenuOpen = false;
      state.isFilterModalOpen = false;
      state.notifications = [];
      state.globalLoading = false;
      state.isSidebarOpen = false;
    },
  },
});

export const {
  openSearchModal,
  closeSearchModal,
  toggleSearchModal,
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
  openFilterModal,
  closeFilterModal,
  toggleFilterModal,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setTheme,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
