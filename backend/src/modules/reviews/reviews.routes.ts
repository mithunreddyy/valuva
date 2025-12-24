import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { ReviewsController } from "./reviews.controller";
import {
  approveReviewSchema,
  createReviewSchema,
  deleteReviewSchema,
  getProductReviewsSchema,
  updateReviewSchema,
} from "./reviews.validation";

const router = Router();
const controller = new ReviewsController();

// Public routes
router.get(
  "/products/:productId",
  validate(getProductReviewsSchema),
  asyncHandler(controller.getProductReviews)
);

// Authenticated routes
router.use(authenticate);

router.post(
  "/",
  validate(createReviewSchema),
  asyncHandler(controller.createReview)
);
router.get("/me", asyncHandler(controller.getUserReviews));
router.put(
  "/:id",
  validate(updateReviewSchema),
  asyncHandler(controller.updateReview)
);
router.delete(
  "/:id",
  validate(deleteReviewSchema),
  asyncHandler(controller.deleteReview)
);

// Admin routes
router.get(
  "/admin/all",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(controller.getAllReviewsForAdmin)
);
router.patch(
  "/:id/approve",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validate(approveReviewSchema),
  asyncHandler(controller.approveReview)
);

export default router;
