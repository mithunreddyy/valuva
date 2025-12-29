import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { ReturnsController } from "./returns.controller";
import {
  createReturnRequestSchema,
  getAllReturnsSchema,
  updateReturnStatusSchema,
} from "./returns.validation";

const router = Router();
const controller = new ReturnsController();

// User routes
router.post(
  "/",
  authenticate,
  validate(createReturnRequestSchema),
  asyncHandler(controller.createReturnRequest)
);
router.get("/", authenticate, asyncHandler(controller.getUserReturns));

// Admin routes
router.get(
  "/all",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validate(getAllReturnsSchema),
  asyncHandler(controller.getAllReturns)
);
router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validate(updateReturnStatusSchema),
  asyncHandler(controller.updateReturnStatus)
);

export default router;
