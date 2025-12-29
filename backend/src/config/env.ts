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

  // Cloud Storage (AWS S3 or Cloudinary)
  STORAGE_PROVIDER: z.enum(["s3", "cloudinary", "local"]).default("local"),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Shipping Carrier (optional - for production integration)
  SHIPPING_CARRIER: z.enum(["shiprocket", "delhivery", "fedex", "ups", "none"]).default("none"),
  SHIPROCKET_EMAIL: z.string().optional(),
  SHIPROCKET_PASSWORD: z.string().optional(),
  DELHIVERY_API_KEY: z.string().optional(),

  // Redis (for caching and background jobs)
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().optional()
  ),
  REDIS_PASSWORD: z.string().optional(),

  // Sentry (error tracking)
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().default("development"),
  SENTRY_TRACES_SAMPLE_RATE: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().default(1.0)
  ),

  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_KEY_ID: z.string().optional(),
  APPLE_PRIVATE_KEY: z.string().optional(),
  APPLE_CALLBACK_URL: z.string().optional(),
  OAUTH_ENCRYPTION_KEY: z.string().optional(), // For encrypting OAuth tokens
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    // Use console.error here as logger might not be initialized yet
    console.error("❌ Invalid environment variables:", error);
    process.exit(1);
  }
};

export const env = parseEnv();
