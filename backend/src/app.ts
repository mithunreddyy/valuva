import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import { API_PREFIX } from "./config/constants";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { performanceMiddleware } from "./middleware/performance.middleware";
import { rateLimiters } from "./middleware/rate-limit.middleware";
import { requestIdMiddleware } from "./middleware/request-id.middleware";

// Existing routes
import addressesRoutes from "./modules/addresses/addresses.routes";
import adminCategoriesRoutes from "./modules/admin/admin-categories.routes";
import adminCouponsRoutes from "./modules/admin/admin-coupons.routes";
import adminHomepageRoutes from "./modules/admin/admin-homepage.routes";
import adminProductsRoutes from "./modules/admin/admin-products.routes";
import adminRoutes from "./modules/admin/admin.routes";
import authRoutes from "./modules/auth/auth.routes";
import oauthRoutes from "./modules/auth/oauth.routes";
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
import newsletterRoutes from "./modules/newsletter/newsletter.routes";
import orderTrackingRoutes from "./modules/order-tracking/tracking.routes";
import recommendationsRoutes from "./modules/recommendations/recommendations.routes";
import returnsRoutes from "./modules/returns/returns.routes";
import shippingRoutes from "./modules/shipping/shipping.routes";
import stockAlertsRoutes from "./modules/stock-alerts/stock-alerts.routes";
import supportRoutes from "./modules/support/support.routes";
import uploadRoutes from "./modules/uploads/upload.routes";

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

  // Compression middleware (reduces response size)
  app.use(compression());

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Session middleware for OAuth
  app.use(
    session({
      secret: env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

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

  // Health Check Endpoints (before authentication)
  const {
    healthCheck,
    readinessCheck,
    livenessCheck,
  } = require("./middleware/health.middleware");
  app.get("/health", healthCheck);
  app.get("/ready", readinessCheck);
  app.get("/live", livenessCheck);

  // API Documentation
  app.get("/", (_req, res) => {
    res.json({
      message: "Valuva E-Commerce API",
      version: "2.0.0",
      documentation: "/api/v1/docs",
      health: "/health",
      features: [
        "Shopify Payment Integration",
        "Advanced Analytics",
        "Multi-channel Notifications",
        "Product Management",
        "Order Processing",
        "User Management",
        "Cloud Storage (S3/Cloudinary)",
        "Image Optimization",
        "Background Jobs",
        "Redis Caching",
        "Error Tracking (Sentry)",
        "Inventory Locking",
        "Circuit Breakers",
        "Retry Logic",
        "Audit Logging",
      ],
    });
  });

  // Swagger API Documentation
  const { setupSwagger } = require("./config/swagger");
  setupSwagger(app);

  // Public routes
  app.use(`${API_PREFIX}/auth`, rateLimiters.auth.middleware(), authRoutes);
  app.use(`${API_PREFIX}/auth/oauth`, oauthRoutes);
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

  // Order tracking routes (public and authenticated)
  app.use(`${API_PREFIX}/order-tracking`, orderTrackingRoutes);

  // Admin routes (with admin rate limiting)
  app.use(`${API_PREFIX}/admin`, rateLimiters.admin.middleware(), adminRoutes);
  app.use(`${API_PREFIX}/admin/products`, adminProductsRoutes);
  app.use(`${API_PREFIX}/admin/categories`, adminCategoriesRoutes);
  app.use(`${API_PREFIX}/admin/coupons`, adminCouponsRoutes);
  app.use(`${API_PREFIX}/admin/homepage`, adminHomepageRoutes);

  // Analytics routes (admin only)
  app.use(`${API_PREFIX}/analytics`, analyticsRoutes);

  // Recommendations routes
  app.use(`${API_PREFIX}/recommendations`, recommendationsRoutes);

  // Stock alerts routes
  app.use(`${API_PREFIX}/stock-alerts`, stockAlertsRoutes);

  // Upload routes (admin only)
  app.use(`${API_PREFIX}/uploads`, uploadRoutes);

  // Newsletter routes
  app.use(`${API_PREFIX}/newsletter`, newsletterRoutes);

  // Returns routes
  app.use(`${API_PREFIX}/returns`, returnsRoutes);

  // Shipping routes
  app.use(`${API_PREFIX}/shipping`, shippingRoutes);

  // Support routes
  app.use(`${API_PREFIX}/support`, supportRoutes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
