/**
 * Database Performance Monitoring Utility
 * Tracks slow queries, connection pool usage, and query patterns
 * Helps identify performance bottlenecks in production
 */

import { prisma } from "../config/database";
import { logger } from "./logger.util";
import { MetricsUtil } from "./metrics.util";

interface QueryMetrics {
  query: string;
  duration: number;
  model?: string;
  operation?: string;
  timestamp: Date;
}

class DatabasePerformanceUtil {
  private slowQueryThreshold = 1000; // 1 second
  private queryMetrics: QueryMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 queries

  /**
   * Track database query performance
   */
  trackQuery(
    query: string,
    duration: number,
    model?: string,
    operation?: string
  ): void {
    const metric: QueryMetrics = {
      query: this.sanitizeQuery(query),
      duration,
      model,
      operation,
      timestamp: new Date(),
    };

    // Add to metrics array
    this.queryMetrics.push(metric);
    if (this.queryMetrics.length > this.maxMetrics) {
      this.queryMetrics.shift();
    }

    // Track in Prometheus metrics
    MetricsUtil.trackDatabaseQuery(
      operation || "unknown",
      model || "unknown",
      duration,
      true
    );

    // Log slow queries
    if (duration > this.slowQueryThreshold) {
      logger.warn("Slow database query detected", {
        query: metric.query,
        duration,
        model,
        operation,
      });
    }
  }

  /**
   * Get slow queries
   */
  getSlowQueries(threshold?: number): QueryMetrics[] {
    const limit = threshold || this.slowQueryThreshold;
    return this.queryMetrics.filter((m) => m.duration > limit);
  }

  /**
   * Get query statistics
   */
  getQueryStats(): {
    total: number;
    averageDuration: number;
    slowQueries: number;
    byModel: Record<string, { count: number; avgDuration: number }>;
    byOperation: Record<string, { count: number; avgDuration: number }>;
  } {
    const stats = {
      total: this.queryMetrics.length,
      averageDuration: 0,
      slowQueries: 0,
      byModel: {} as Record<string, { count: number; avgDuration: number }>,
      byOperation: {} as Record<string, { count: number; avgDuration: number }>,
    };

    if (this.queryMetrics.length === 0) {
      return stats;
    }

    let totalDuration = 0;
    for (const metric of this.queryMetrics) {
      totalDuration += metric.duration;

      if (metric.duration > this.slowQueryThreshold) {
        stats.slowQueries++;
      }

      if (metric.model) {
        if (!stats.byModel[metric.model]) {
          stats.byModel[metric.model] = { count: 0, avgDuration: 0 };
        }
        stats.byModel[metric.model].count++;
        stats.byModel[metric.model].avgDuration += metric.duration;
      }

      if (metric.operation) {
        if (!stats.byOperation[metric.operation]) {
          stats.byOperation[metric.operation] = { count: 0, avgDuration: 0 };
        }
        stats.byOperation[metric.operation].count++;
        stats.byOperation[metric.operation].avgDuration += metric.duration;
      }
    }

    stats.averageDuration = totalDuration / this.queryMetrics.length;

    // Calculate averages
    for (const model in stats.byModel) {
      const data = stats.byModel[model];
      data.avgDuration = data.avgDuration / data.count;
    }

    for (const operation in stats.byOperation) {
      const data = stats.byOperation[operation];
      data.avgDuration = data.avgDuration / data.count;
    }

    return stats;
  }

  /**
   * Get connection pool status
   */
  async getConnectionPoolStatus(): Promise<{
    active: number;
    idle: number;
    total: number;
  }> {
    try {
      // Prisma doesn't expose connection pool stats directly
      // This is a placeholder - in production, you might use pg_stat_activity
      const result = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT count(*) as count
        FROM pg_stat_activity
        WHERE datname = current_database()
      `;

      return {
        active: Number(result[0]?.count || 0),
        idle: 0, // Would need additional query
        total: Number(result[0]?.count || 0),
      };
    } catch (error) {
      logger.error("Failed to get connection pool status", {
        error: error instanceof Error ? error.message : String(error),
      });
      return { active: 0, idle: 0, total: 0 };
    }
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.queryMetrics = [];
  }

  /**
   * Sanitize query for logging (remove sensitive data)
   */
  private sanitizeQuery(query: string): string {
    return query
      .replace(/'[^']*'/g, "'***'") // Replace string literals
      .replace(/\$\d+/g, "$?") // Replace parameter placeholders
      .substring(0, 500); // Limit length
  }
}

export const dbPerformance = new DatabasePerformanceUtil();

