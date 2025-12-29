/**
 * Services Index
 * Central export point for all service modules
 * 
 * This file provides a single import point for all services,
 * making it easier to import multiple services in components and hooks.
 */

// Core Services
export { addressesService } from "./addresses.service";
export { authService } from "./auth.service";
export { cartService } from "./cart.service";
export { categoriesService } from "./categories.service";
export { couponsService } from "./coupons.service";
export { newsletterService } from "./newsletter.service";
export { ordersService } from "./orders.service";
export { paymentsService } from "./payments.service";
export { productsService } from "./products.service";
export { recommendationsService } from "./recommendations.service";
export { reviewsService } from "./reviews.service";
export { stockAlertsService } from "./stock-alerts.service";
export { trackingService } from "./tracking.service";
export { usersService } from "./users.service";
export { wishlistService } from "./wishlist.service";

// API Services
export { addressesApi } from "./api/addresses";
export { adminApi } from "./api/admin";
export { adminMFAApi } from "./api/admin-mfa";
export { authApi } from "./api/auth";
export { cartApi } from "./api/cart";
export { categoriesApi } from "./api/categories";
export { contactApi } from "./api/contact";
export { couponsApi } from "./api/coupons";
export { homepageApi } from "./api/homepage";
export { newsletterApi } from "./api/newsletter";
export { ordersApi } from "./api/orders";
export { paymentsApi } from "./api/payments";
export { productsApi } from "./api/products";
export { recommendationsApi } from "./api/recommendations";
export { returnsApi } from "./api/returns";
export { reviewsApi } from "./api/reviews";
export { stockAlertsApi } from "./api/stock-alerts";
export { supportApi } from "./api/support";
export { trackingApi } from "./api/tracking";
export { usersApi } from "./api/users";
export { wishlistApi } from "./api/wishlist";

