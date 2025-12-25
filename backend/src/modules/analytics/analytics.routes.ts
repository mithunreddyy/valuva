import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { AnalyticsController } from "./analytics.controller";

const router = Router();
const controller = new AnalyticsController();

// All analytics routes require admin authentication
router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get("/sales-metrics", asyncHandler(controller.getSalesMetrics));
router.get("/top-products", asyncHandler(controller.getTopProducts));
router.get("/revenue-trends", asyncHandler(controller.getRevenueTrends));
router.get(
  "/customer-analytics",
  asyncHandler(controller.getCustomerAnalytics)
);
router.get(
  "/inventory-insights",
  asyncHandler(controller.getInventoryInsights)
);
router.get(
  "/category-performance",
  asyncHandler(controller.getCategoryPerformance)
);

export default router;
