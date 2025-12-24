import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { WishlistController } from "./wishlist.controller";
import {
  addToWishlistSchema,
  removeFromWishlistSchema,
} from "./wishlist.validation";

const router = Router();
const controller = new WishlistController();

router.use(authenticate);

router.get("/", asyncHandler(controller.getWishlist));
router.post(
  "/items",
  validate(addToWishlistSchema),
  asyncHandler(controller.addToWishlist)
);
router.delete(
  "/items/:productId",
  validate(removeFromWishlistSchema),
  asyncHandler(controller.removeFromWishlist)
);

export default router;
