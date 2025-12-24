import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().default(5000)
  ),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_ROUNDS: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().default(12)
  ),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  RATE_LIMIT_WINDOW_MS: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().default(900000)
  ),
  RATE_LIMIT_MAX_REQUESTS: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().default(100)
  ),

  // Shopify Payment Gateway
  SHOPIFY_API_URL: z.string().default("https://your-shop.myshopify.com"),
  SHOPIFY_ACCESS_TOKEN: z.string(),
  SHOPIFY_SHOP_DOMAIN: z.string(),
  SHOPIFY_WEBHOOK_SECRET: z.string(),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    process.exit(1);
  }
};

export const env = parseEnv();
