import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { asyncHandler } from "../../middleware/async.middleware";
import { uploadMiddleware } from "../../middleware/upload.middleware";
import { UploadController } from "./upload.controller";

const router = Router();
const controller = new UploadController();

// Single image upload (admin only)
router.post(
  "/image",
  authMiddleware,
  rbacMiddleware(["ADMIN", "SUPER_ADMIN"]),
  uploadMiddleware.single("image"),
  asyncHandler(controller.uploadImage)
);

// Multiple images upload (admin only)
router.post(
  "/images",
  authMiddleware,
  rbacMiddleware(["ADMIN", "SUPER_ADMIN"]),
  uploadMiddleware.array("images", 10),
  asyncHandler(controller.uploadMultipleImages)
);

export default router;

