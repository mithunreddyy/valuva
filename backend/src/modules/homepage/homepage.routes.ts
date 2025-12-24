import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { validate } from "../../middleware/validate.middleware";
import { HomepageController } from "./homepage.controller";
import {
  getHomepageBestSellersSchema,
  getHomepageFeaturedSchema,
  getHomepageNewArrivalsSchema,
  getHomepageSectionsSchema,
} from "./homepage.validation";

const router = Router();
const controller = new HomepageController();

router.get(
  "/sections",
  validate(getHomepageSectionsSchema),
  asyncHandler(controller.getSections)
);

router.get(
  "/featured",
  validate(getHomepageFeaturedSchema),
  asyncHandler(controller.getFeatured)
);

router.get(
  "/new-arrivals",
  validate(getHomepageNewArrivalsSchema),
  asyncHandler(controller.getNewArrivals)
);

router.get(
  "/best-sellers",
  validate(getHomepageBestSellersSchema),
  asyncHandler(controller.getBestSellers)
);

export default router;
