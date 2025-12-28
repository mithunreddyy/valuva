import { Request, Response } from "express";
import { prisma } from "../config/database";
import { env } from "../config/env";
import { getRedis } from "../config/redis";
import { logger } from "../utils/logger.util";

/**
 * Health Check Endpoint
 * Production-ready health monitoring for load balancers and monitoring systems
 */
export const healthCheck = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
    checks: {
      database: "unknown",
      redis: "unknown",
      memory: "unknown",
    },
  };

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = "healthy";
  } catch (error) {
    health.checks.database = "unhealthy";
    health.status = "unhealthy";
    logger.error("Database health check failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Check Redis
  try {
    const redis = getRedis();
    if (redis) {
      await redis.ping();
      health.checks.redis = "healthy";
    } else {
      health.checks.redis = "disabled";
    }
  } catch (error) {
    health.checks.redis = "unhealthy";
    // Redis failure doesn't make the app unhealthy
    logger.warn("Redis health check failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Check memory
  const memoryUsage = process.memoryUsage();
  const memoryUsageMB = {
    rss: Math.round(memoryUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    external: Math.round(memoryUsage.external / 1024 / 1024),
  };

  // Warn if memory usage is high (> 80% of 512MB default)
  const memoryThreshold = 512 * 0.8; // 80% of 512MB
  if (memoryUsageMB.heapUsed > memoryThreshold) {
    health.checks.memory = "warning";
    logger.warn("High memory usage detected", memoryUsageMB);
  } else {
    health.checks.memory = "healthy";
  }

  health.checks.memory = {
    status: health.checks.memory,
    ...memoryUsageMB,
  } as any;

  const statusCode = health.status === "healthy" ? 200 : 503;
  res.status(statusCode).json(health);
};

/**
 * Readiness Check
 * Used by Kubernetes/Docker to determine if app is ready to receive traffic
 */
export const readinessCheck = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check critical dependencies
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Readiness check failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(503).json({
      status: "not ready",
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Liveness Check
 * Used by Kubernetes/Docker to determine if app is alive
 */
export const livenessCheck = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
