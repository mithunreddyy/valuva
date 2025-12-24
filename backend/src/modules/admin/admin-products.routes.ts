import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { AdminProductsController } from "./admin-products.controller";
import {
  createProductSchema,
  createVariantSchema,
  updateInventorySchema,
  updateProductSchema,
  updateVariantSchema,
} from "./admin-products.validation";

const router = Router();
const controller = new AdminProductsController();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

// Product management
router.get("/products", asyncHandler(controller.getAllProducts));
router.get("/products/low-stock", asyncHandler(controller.getLowStockProducts));
router.get("/products/:id", asyncHandler(controller.getProductById));
router.post(
  "/products",
  validate(createProductSchema),
  asyncHandler(controller.createProduct)
);
router.put(
  "/products/:id",
  validate(updateProductSchema),
  asyncHandler(controller.updateProduct)
);
router.delete("/products/:id", asyncHandler(controller.deleteProduct));

// Variant management
router.post(
  "/variants",
  validate(createVariantSchema),
  asyncHandler(controller.createVariant)
);
router.put(
  "/variants/:id",
  validate(updateVariantSchema),
  asyncHandler(controller.updateVariant)
);
router.patch(
  "/variants/:id/inventory",
  validate(updateInventorySchema),
  asyncHandler(controller.updateInventory)
);

// Image management
router.post("/images", asyncHandler(controller.addProductImage));
router.delete("/images/:id", asyncHandler(controller.deleteProductImage));

export default router;
