import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.util";
import { env } from "./env";

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
  client.$on("error" as never, (e: { message?: string; target?: string }) => {
    logger.error("Prisma database error", {
      error: e.message || "Unknown error",
      target: e.target,
    });
  });

  // Log slow queries and track performance
  client.$use(async (params: any, next: any) => {
    const before = Date.now();
    const prismaParams = params as { model?: string; action?: string };
    let result;

    try {
      result = await next(params);
    } catch (error) {
      const after = Date.now();
      const duration = after - before;

      // Track failed query performance
      const { dbPerformance } = await import("../utils/db-performance.util");
      dbPerformance.trackQuery(
        `${prismaParams.model || "unknown"}.${prismaParams.action || "unknown"}`,
        duration,
        prismaParams.model,
        prismaParams.action
      );
      throw error;
    }

    const after = Date.now();
    const duration = after - before;

    // Track query performance
    const { dbPerformance } = await import("../utils/db-performance.util");
    dbPerformance.trackQuery(
      `${prismaParams.model || "unknown"}.${prismaParams.action || "unknown"}`,
      duration,
      prismaParams.model,
      prismaParams.action
    );

    // Log slow queries
    if (duration > 1000) {
      logger.warn("Slow database query detected", {
        model: prismaParams.model,
        action: prismaParams.action,
        duration: `${duration}ms`,
      });
    }

    return result;
  });

  return client;
};

declare global {
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
