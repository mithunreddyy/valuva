import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { API_PREFIX } from "./config/constants";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { performanceMiddleware } from "./middleware/performance.middleware";
import { rateLimiters } from "./middleware/rate-limit.middleware";
import { requestIdMiddleware } from "./middleware/request-id.middleware";

// Existing routes
import addressesRoutes from "./modules/addresses/addresses.routes";
import adminCategoriesRoutes from "./modules/admin/admin-categories.routes";
import adminHomepageRoutes from "./modules/admin/admin-homepage.routes";
import adminProductsRoutes from "./modules/admin/admin-products.routes";
import adminRoutes from "./modules/admin/admin.routes";
import authRoutes from "./modules/auth/auth.routes";
import cartRoutes from "./modules/cart/cart.routes";
import categoriesRoutes from "./modules/categories/categories.routes";
import couponsRoutes from "./modules/coupons/coupons.routes";
import homepageRoutes from "./modules/homepage/homepage.routes";
import ordersRoutes from "./modules/orders/orders.routes";
import paymentsRoutes from "./modules/payments/payments.routes";
import productsRoutes from "./modules/products/products.routes";
import reviewsRoutes from "./modules/reviews/reviews.routes";
import usersRoutes from "./modules/users/users.routes";
import wishlistRoutes from "./modules/wishlist/wishlist.routes";

// New routes
import analyticsRoutes from "./modules/analytics/analytics.routes";

export const createApp = (): Application => {
  const app = express();

  // Request ID middleware (must be first)
  app.use(requestIdMiddleware);

  // Performance monitoring middleware
  app.use(performanceMiddleware);

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // Rate limiting middleware
  app.use(rateLimiters.general.middleware());

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Logging middleware
  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      version: "2.0.0",
      features: {
        shopifyPayments: true,
        analytics: true,
        notifications: true,
      },
    });
  });

  // API Documentation
  app.get("/", (_req, res) => {
    res.json({
      message: "Valuva E-Commerce API",
      version: "2.0.0",
      documentation: "/api/v1/docs",
      features: [
        "Shopify Payment Integration",
        "Advanced Analytics",
        "Multi-channel Notifications",
        "Product Management",
        "Order Processing",
        "User Management",
      ],
    });
  });

  // Public routes
  app.use(`${API_PREFIX}/auth`, rateLimiters.auth.middleware(), authRoutes);
  app.use(`${API_PREFIX}/products`, productsRoutes);
  app.use(`${API_PREFIX}/categories`, categoriesRoutes);
  app.use(`${API_PREFIX}/homepage`, homepageRoutes);
  app.use(`${API_PREFIX}/coupons`, couponsRoutes);

  // Authenticated user routes
  app.use(`${API_PREFIX}/cart`, cartRoutes);
  app.use(`${API_PREFIX}/orders`, ordersRoutes);
  app.use(`${API_PREFIX}/wishlist`, wishlistRoutes);
  app.use(`${API_PREFIX}/addresses`, addressesRoutes);
  app.use(`${API_PREFIX}/reviews`, reviewsRoutes);
  app.use(`${API_PREFIX}/users`, usersRoutes);

  // Payment routes
  app.use(`${API_PREFIX}/payments`, paymentsRoutes);

  // Admin routes (with admin rate limiting)
  app.use(`${API_PREFIX}/admin`, rateLimiters.admin.middleware(), adminRoutes);
  app.use(`${API_PREFIX}/admin`, adminProductsRoutes);
  app.use(`${API_PREFIX}/admin`, adminCategoriesRoutes);
  app.use(`${API_PREFIX}/admin`, adminHomepageRoutes);

  // Analytics routes (admin only)
  app.use(`${API_PREFIX}/analytics`, analyticsRoutes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
