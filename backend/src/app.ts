import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware";
import routes from "./routes";

const app = express();

// security headers
app.use(helmet());

// JSON & urlencoded
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// logging
app.use(morgan("dev"));

// rate limiting - basic protection (tune for prod)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

// CORS (restrict in production)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

// API routes
app.use("/api", routes);

// health
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// error handler (last)
app.use(errorHandler);

export default app;
