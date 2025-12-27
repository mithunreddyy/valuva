import { z } from "zod";

/**
 * Validation schema for date range query parameters
 */
const dateRangeSchema = z.object({
  startDate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Invalid start date format" }
    ),
  endDate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Invalid end date format" }
    ),
});

/**
 * Validation schema for getting sales metrics
 */
export const getSalesMetricsSchema = z.object({
  query: dateRangeSchema,
});

/**
 * Validation schema for getting top products
 */
export const getTopProductsSchema = z.object({
  query: dateRangeSchema.extend({
    limit: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const num = parseInt(val, 10);
          return !isNaN(num) && num > 0 && num <= 100;
        },
        { message: "Limit must be a number between 1 and 100" }
      ),
  }),
});

/**
 * Validation schema for getting revenue trends
 */
export const getRevenueTrendsSchema = z.object({
  query: dateRangeSchema.extend({
    groupBy: z.enum(["day", "week", "month"]).optional(),
  }),
});

/**
 * Validation schema for getting customer analytics
 */
export const getCustomerAnalyticsSchema = z.object({
  query: dateRangeSchema,
});

/**
 * Validation schema for getting inventory insights
 * Currently no params/query needed
 */
export const getInventoryInsightsSchema = z.object({});

/**
 * Validation schema for getting category performance
 */
export const getCategoryPerformanceSchema = z.object({
  query: dateRangeSchema,
});

