/**
 * Components Index
 * Central export point for all component modules
 *
 * This file provides a single import point for all components,
 * making it easier to import multiple components in pages and other components.
 */

// Reviews Components
export { ReviewCard } from "./reviews/review-card";
export { ReviewRating } from "./reviews/review-rating";

// Support Components
export { TicketCard } from "./support/ticket-card";

// Returns Components
export { ReturnStatusCard } from "./returns/return-status-card";

// User Components
export { ProfileStatsCard } from "./user/profile-stats-card";

// Stock Alerts Components
export { StockAlertCard } from "./stock-alerts/stock-alert-card";
export { StockAlertsList } from "./stock-alerts/stock-alerts-list";

// Recommendations Components
export { TrendingProducts } from "./recommendations/trending-products";

// Shared Components
export { ErrorState } from "./shared/error-state";
export { LoadingState } from "./shared/loading-state";

// Layout Components
export { CookieConsent } from "./layout/cookie-consent";
export { Footer } from "./layout/footer";
export { Header } from "./layout/header";
export { NewsletterSignup } from "./layout/newsletter-signup";

// Home Components
export { CategoryShowcase } from "./home/category-showcase";
export { FeaturedProducts } from "./home/featured-products";
export { HeroSection } from "./home/hero-section";
export { NewArrivals } from "./home/new-arrivals";

// Products Components
export { ProductCard } from "./products/ProductCard";
export { ProductCardSkeleton } from "./products/product-card-skeleton";
export { ProductDetail } from "./products/product-detail";
export { ProductGrid } from "./products/product-grid";
export { ProductRecommendations } from "./products/product-recommendations";
export { ProductReviews } from "./products/product-reviews";
export { RecentlyViewed } from "./products/recently-viewed";
export { StockAlertButton } from "./products/stock-alert-button";

// Orders Components
export { OrderCard } from "./orders/order-card";
export { OrderTracking } from "./orders/order-tracking";

// Wishlist Components
export { WishlistItemCard } from "./wishlist/wishlist-item";

// Auth Components
export { OAuthButtons } from "./auth/oauth-buttons";
export { OAuthErrorBoundary } from "./auth/oauth-error-boundary";

// Admin Components
export { CategoryFormModal } from "./admin/category-form-modal";
export { CouponFormModal } from "./admin/coupon-form-modal";
export { HomepageSectionFormModal } from "./admin/homepage-section-form-modal";
export { ImageUpload } from "./admin/image-upload";
export { ProductForm } from "./admin/product-form";
export { SubCategoryFormModal } from "./admin/subcategory-form-modal";

// UI Components
export * from "./ui/alert";
export * from "./ui/badge";
export * from "./ui/button";
export * from "./ui/card";
export * from "./ui/dialog";
export * from "./ui/dropdown-menu";
export * from "./ui/empty-state";
export * from "./ui/input";
export * from "./ui/label";
export * from "./ui/loading-spinner";
export * from "./ui/pagination";
export * from "./ui/password-input";
export * from "./ui/radio-group";
export * from "./ui/select";
export * from "./ui/skeleton";
export * from "./ui/switch";
export * from "./ui/tabs";
export * from "./ui/textarea";
export * from "./ui/toast";

// Error Boundary
export { ErrorBoundary } from "./error-boundary";
