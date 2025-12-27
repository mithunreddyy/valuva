import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { AnalyticsController } from "./analytics.controller";
import {
  getCategoryPerformanceSchema,
  getCustomerAnalyticsSchema,
  getInventoryInsightsSchema,
  getRevenueTrendsSchema,
  getSalesMetricsSchema,
  getTopProductsSchema,
} from "./analytics.validation";

const router = Router();
const controller = new AnalyticsController();

// All analytics routes require admin authentication
router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get(
  "/sales-metrics",
  validate(getSalesMetricsSchema),
  asyncHandler(controller.getSalesMetrics)
);
router.get(
  "/top-products",
  validate(getTopProductsSchema),
  asyncHandler(controller.getTopProducts)
);
router.get(
  "/revenue-trends",
  validate(getRevenueTrendsSchema),
  asyncHandler(controller.getRevenueTrends)
);
router.get(
  "/customer-analytics",
  validate(getCustomerAnalyticsSchema),
  asyncHandler(controller.getCustomerAnalytics)
);
router.get(
  "/inventory-insights",
  validate(getInventoryInsightsSchema),
  asyncHandler(controller.getInventoryInsights)
);
router.get(
  "/category-performance",
  validate(getCategoryPerformanceSchema),
  asyncHandler(controller.getCategoryPerformance)
);

export default router;
