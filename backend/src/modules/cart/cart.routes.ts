import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { CartController } from "./cart.controller";
import {
  addToCartSchema,
  removeCartItemSchema,
  updateCartItemSchema,
} from "./cart.validation";

const router = Router();
const controller = new CartController();

router.use(authenticate);

router.get("/", asyncHandler(controller.getCart));
router.post(
  "/items",
  validate(addToCartSchema),
  asyncHandler(controller.addToCart)
);
router.put(
  "/items/:itemId",
  validate(updateCartItemSchema),
  asyncHandler(controller.updateCartItem)
);
router.delete(
  "/items/:itemId",
  validate(removeCartItemSchema),
  asyncHandler(controller.removeCartItem)
);
router.delete("/", asyncHandler(controller.clearCart));

export default router;
