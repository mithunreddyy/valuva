import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { validate } from "../../middleware/validate.middleware";
import { CategoriesController } from "./categories.controller";
import {
  getCategoriesSchema,
  getCategoryBySlugSchema,
  getSubCategoryBySlugSchema,
} from "./categories.validation";

const router = Router();
const controller = new CategoriesController();

router.get(
  "/",
  validate(getCategoriesSchema),
  asyncHandler(controller.getCategories)
);
router.get(
  "/:slug",
  validate(getCategoryBySlugSchema),
  asyncHandler(controller.getCategoryBySlug)
);
router.get(
  "/:categorySlug/:subCategorySlug",
  validate(getSubCategoryBySlugSchema),
  asyncHandler(controller.getSubCategoryBySlug)
);

export default router;
