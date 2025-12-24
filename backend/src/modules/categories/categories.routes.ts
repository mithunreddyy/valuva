import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { CategoriesController } from "./categories.controller";

const router = Router();
const controller = new CategoriesController();

router.get("/", asyncHandler(controller.getCategories));
router.get("/:slug", asyncHandler(controller.getCategoryBySlug));
router.get(
  "/:categorySlug/:subCategorySlug",
  asyncHandler(controller.getSubCategoryBySlug)
);

export default router;
