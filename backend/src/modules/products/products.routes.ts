import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { validate } from "../../middleware/validate.middleware";
import { ProductsController } from "./products.controller";
import { getProductByIdSchema, getProductsSchema } from "./products.validation";

const router = Router();
const controller = new ProductsController();

router.get(
  "/",
  validate(getProductsSchema),
  asyncHandler(controller.getProducts)
);
router.get("/search", asyncHandler(controller.searchProducts));
router.get(
  "/:id",
  validate(getProductByIdSchema),
  asyncHandler(controller.getProductById)
);
router.get(
  "/:id/related",
  validate(getProductByIdSchema),
  asyncHandler(controller.getRelatedProducts)
);

export default router;
