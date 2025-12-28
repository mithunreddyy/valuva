import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { asyncHandler } from "../../middleware/async.middleware";
import { NewsletterController } from "./newsletter.controller";
import { UserRole } from "@prisma/client";

const router = Router();
const controller = new NewsletterController();

// Public routes
router.post("/subscribe", asyncHandler(controller.subscribe));
router.post("/unsubscribe", asyncHandler(controller.unsubscribe));

// Admin routes
router.get(
  "/",
    authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(controller.getAllSubscriptions)
);

export default router;

