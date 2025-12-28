import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { ReturnsController } from "./returns.controller";

const router = Router();
const controller = new ReturnsController();

// User routes
router.post("/", authenticate, asyncHandler(controller.createReturnRequest));
router.get("/", authenticate, asyncHandler(controller.getUserReturns));

// Admin routes
router.get(
  "/all",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(controller.getAllReturns)
);
router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(controller.updateReturnStatus)
);

export default router;
