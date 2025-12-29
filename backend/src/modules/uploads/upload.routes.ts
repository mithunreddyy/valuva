import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { uploadMiddleware } from "../../middleware/upload.middleware";
import { UploadController } from "./upload.controller";

const router = Router();
const controller = new UploadController();

// Single image upload (admin only)
router.post(
  "/image",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadMiddleware.single("image"),
  asyncHandler(controller.uploadImage)
);

// Multiple images upload (admin only)
router.post(
  "/images",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadMiddleware.array("images", 10),
  asyncHandler(controller.uploadMultipleImages)
);

export default router;
