import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { API_PREFIX } from "./config/constants";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

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

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/products`, productsRoutes);
  app.use(`${API_PREFIX}/cart`, cartRoutes);
  app.use(`${API_PREFIX}/orders`, ordersRoutes);
  app.use(`${API_PREFIX}/homepage`, homepageRoutes);
  app.use(`${API_PREFIX}/wishlist`, wishlistRoutes);
  app.use(`${API_PREFIX}/admin`, adminRoutes);
  app.use(`${API_PREFIX}/admin`, adminProductsRoutes);
  app.use(`${API_PREFIX}/admin`, adminCategoriesRoutes);
  app.use(`${API_PREFIX}/admin`, adminHomepageRoutes);
  app.use(`${API_PREFIX}/payments`, paymentsRoutes);
  app.use(`${API_PREFIX}/addresses`, addressesRoutes);
  app.use(`${API_PREFIX}/categories`, categoriesRoutes);
  app.use(`${API_PREFIX}/reviews`, reviewsRoutes);
  app.use(`${API_PREFIX}/coupons`, couponsRoutes);
  app.use(`${API_PREFIX}/users`, usersRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
