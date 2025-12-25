import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { OrderTrackingController } from "./tracking.controller";
import {
  addTrackingUpdateSchema,
  trackByEmailSchema,
  trackOrderSchema,
  updateTrackingSchema,
} from "./tracking.validation";

const router = Router();
const controller = new OrderTrackingController();

// Public endpoint - track with order number and email
router.post(
  "/track",
  validate(trackByEmailSchema),
  asyncHandler(controller.trackOrderPublic)
);

// Authenticated customer endpoints
router.get(
  "/:orderNumber",
  authenticate,
  validate(trackOrderSchema),
  asyncHandler(controller.trackOrder)
);

// Admin endpoints
router.get(
  "/admin/active-orders",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(controller.getAllActiveOrders)
);

router.patch(
  "/admin/:orderId/update",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validate(updateTrackingSchema),
  asyncHandler(controller.updateOrderTracking)
);

router.post(
  "/admin/:orderId/tracking-update",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validate(addTrackingUpdateSchema),
  asyncHandler(controller.addTrackingUpdate)
);

export default router;
