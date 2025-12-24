import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { UsersController } from "./users.controller";
import {
  changePasswordSchema,
  updateProfileSchema,
  updateUserStatusSchema,
} from "./users.validation";

const router = Router();
const controller = new UsersController();

// Authenticated user routes
router.use(authenticate);

router.get("/profile", asyncHandler(controller.getProfile));
router.put(
  "/profile",
  validate(updateProfileSchema),
  asyncHandler(controller.updateProfile)
);
router.post(
  "/change-password",
  validate(changePasswordSchema),
  asyncHandler(controller.changePassword)
);
router.get("/stats", asyncHandler(controller.getUserStats));

// Admin routes
router.get(
  "/admin/all",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(controller.getAllUsers)
);
router.get(
  "/admin/:id",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(controller.getUserDetails)
);
router.patch(
  "/admin/:id/status",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validate(updateUserStatusSchema),
  asyncHandler(controller.updateUserStatus)
);

export default router;
