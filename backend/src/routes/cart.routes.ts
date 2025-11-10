// File: src/routes/cart.routes.ts
import { Router } from "express";
import { cartController } from "../controllers/cart.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();
router.use(authenticateJWT);

router.get("/", cartController.getCart.bind(cartController));
router.get("/summary", cartController.summary.bind(cartController));
router.post("/add", cartController.add.bind(cartController));
router.patch("/update", cartController.update.bind(cartController));
router.delete("/remove", cartController.remove.bind(cartController));
router.delete("/clear", cartController.clear.bind(cartController));
router.post("/coupon", cartController.applyCoupon.bind(cartController));
router.delete("/coupon", cartController.removeCoupon.bind(cartController));
router.post("/sync", cartController.sync.bind(cartController));
router.get("/validate", cartController.validate.bind(cartController));
router.post(
  "/move-to-wishlist/:id",
  cartController.moveToWishlist.bind(cartController)
);
router.post("/bulk-add", cartController.bulkAdd.bind(cartController));
router.get("/saved", cartController.saved.bind(cartController));
router.post("/save/:id", cartController.save.bind(cartController));
router.post("/restore/:id", cartController.restore.bind(cartController));

export default router;
