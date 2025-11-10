// File: src/routes/product.routes.ts
import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Public
router.get("/", productController.getAll.bind(productController));
router.get("/search", productController.search.bind(productController));
router.get("/featured", productController.featured.bind(productController));
router.get(
  "/category/:category",
  productController.byCategory.bind(productController)
);
router.get("/:id", productController.getById.bind(productController));
router.get("/:id/related", productController.related.bind(productController));
router.get(
  "/:id/reviews",
  productController.getReviews.bind(productController)
);
router.post(
  "/:id/check-stock",
  productController.checkStock.bind(productController)
);

// Authenticated
router.post(
  "/:id/reviews",
  authenticateJWT,
  productController.addReview.bind(productController)
);
router.post(
  "/:id/wishlist",
  authenticateJWT,
  productController.addToWishlist.bind(productController)
);

// Admin
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin"),
  productController.create.bind(productController)
);
router.post(
  "/bulk",
  authenticateJWT,
  authorizeRoles("admin"),
  productController.bulkCreate.bind(productController)
);
router.post(
  "/:id/images",
  authenticateJWT,
  authorizeRoles("admin"),
  productController.uploadImages.bind(productController)
);
router.patch(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  productController.update.bind(productController)
);
router.patch(
  "/:id/stock",
  authenticateJWT,
  authorizeRoles("admin"),
  productController.updateStock.bind(productController)
);
router.patch(
  "/:id/toggle",
  authenticateJWT,
  authorizeRoles("admin"),
  productController.toggleActive.bind(productController)
);
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  productController.delete.bind(productController)
);
router.post(
  "/bulk-delete",
  authenticateJWT,
  authorizeRoles("admin"),
  productController.bulkDelete.bind(productController)
);

export default router;
