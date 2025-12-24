import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { AdminCategoriesController } from "./admin-categories.controller";
import {
  createCategorySchema,
  createSubCategorySchema,
  updateCategorySchema,
  updateSubCategorySchema,
} from "./admin-categories.validation";

const router = Router();
const controller = new AdminCategoriesController();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

// Categories
router.get("/categories", asyncHandler(controller.getAllCategories));
router.get("/categories/:id", asyncHandler(controller.getCategoryById));
router.post(
  "/categories",
  validate(createCategorySchema),
  asyncHandler(controller.createCategory)
);
router.put(
  "/categories/:id",
  validate(updateCategorySchema),
  asyncHandler(controller.updateCategory)
);
router.delete("/categories/:id", asyncHandler(controller.deleteCategory));

// SubCategories
router.get("/subcategories", asyncHandler(controller.getAllSubCategories));
router.get("/subcategories/:id", asyncHandler(controller.getSubCategoryById));
router.post(
  "/subcategories",
  validate(createSubCategorySchema),
  asyncHandler(controller.createSubCategory)
);
router.put(
  "/subcategories/:id",
  validate(updateSubCategorySchema),
  asyncHandler(controller.updateSubCategory)
);
router.delete("/subcategories/:id", asyncHandler(controller.deleteSubCategory));

export default router;
