import { PrismaClient } from "@prisma/client";
import { env } from "./env";
import { logger } from "../utils/logger.util";

/**
 * Prisma Client Singleton with Production-Ready Configuration
 * 
 * Features:
 * - Connection pooling (configured via DATABASE_URL)
 * - Query logging (development only)
 * - Error handling
 * - Connection lifecycle management
 * 
 * Connection Pool Configuration:
 * Add to DATABASE_URL: ?connection_limit=20&pool_timeout=20&connect_timeout=10
 * 
 * Recommended pool settings:
 * - connection_limit: 20-50 (adjust based on server capacity)
 * - pool_timeout: 20 seconds
 * - connect_timeout: 10 seconds
 */
const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });

  // Handle connection errors
  client.$on("error" as never, (e: any) => {
    logger.error("Prisma database error", {
      error: e.message,
      target: e.target,
    });
  });

  // Log slow queries in production
  if (env.NODE_ENV === "production") {
    const startTime = Date.now();
    client.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      const duration = after - before;

      // Log queries taking more than 1 second
      if (duration > 1000) {
        logger.warn("Slow database query detected", {
          model: params.model,
          action: params.action,
          duration: `${duration}ms`,
        });
      }

      return result;
    });
  }

  return client;
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  logger.info("Database connection closed");
});
