import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import addressesReducer from "./slices/addressesSlice";
import adminHomepageReducer from "./slices/adminHomepageSlice";
import adminReducer from "./slices/adminSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import categoriesReducer from "./slices/categoriesSlice";
import comparisonReducer from "./slices/comparisonSlice";
import contactReducer from "./slices/contactSlice";
import cookieReducer from "./slices/cookieSlice";
import filtersReducer from "./slices/filtersSlice";
import newsletterReducer from "./slices/newsletterSlice";
import ordersReducer from "./slices/ordersSlice";
import paymentReducer from "./slices/paymentSlice";
import productsReducer from "./slices/productsSlice";
import returnsReducer from "./slices/returnsSlice";
import reviewsReducer from "./slices/reviewsSlice";
import searchReducer from "./slices/searchSlice";
import supportReducer from "./slices/supportSlice";
import uiReducer from "./slices/uiSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
    categories: categoriesReducer,
    addresses: addressesReducer,
    reviews: reviewsReducer,
    ui: uiReducer,
    filters: filtersReducer,
    comparison: comparisonReducer,
    // New slices
    admin: adminReducer,
    adminHomepage: adminHomepageReducer,
    support: supportReducer,
    contact: contactReducer,
    payment: paymentReducer,
    newsletter: newsletterReducer,
    search: searchReducer,
    cookie: cookieReducer,
    returns: returnsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
