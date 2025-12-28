import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../middleware/async.middleware";
import { RecommendationsController } from "./recommendations.controller";

const router = Router();
const controller = new RecommendationsController();

// Get recently viewed products (authenticated)
router.get(
  "/recently-viewed",
  authenticate,
  asyncHandler(controller.getRecentlyViewed)
);

// Get similar products (public)
router.get(
  "/similar/:productId",
  asyncHandler(controller.getSimilarProducts)
);

// Get frequently bought together (public)
router.get(
  "/frequently-bought/:productId",
  asyncHandler(controller.getFrequentlyBoughtTogether)
);

export default router;

