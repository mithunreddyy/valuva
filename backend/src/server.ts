import express from "express";
import {
  compressionMiddleware,
  corsMiddleware,
  errorHandler,
  generalLimiter,
  jsonParser,
  notFound,
  requestId,
  securityHeaders,
  urlencodedParser,
} from "./middlewares";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import checkoutRoutes from "./routes/checkout.routes";
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// Security & CORS
app.use(securityHeaders);
app.use(corsMiddleware);

// Request parsing
app.use(jsonParser);
app.use(urlencodedParser);

// Compression
app.use(compressionMiddleware);

// Logging
app.use(requestId);

// Rate limiting
app.use("/api", generalLimiter);

// Your routes here
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/users", userRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
