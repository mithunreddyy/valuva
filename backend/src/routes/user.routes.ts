// File: src/routes/user.routes.ts
import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Authenticated routes
router.use(authenticateJWT);

// Profile
router.get("/me", userController.me.bind(userController));
router.patch("/me", userController.updateMe.bind(userController));
router.post("/me/avatar", userController.uploadAvatar.bind(userController));
router.patch(
  "/me/password",
  userController.changePassword.bind(userController)
);
router.delete("/me", userController.deleteAccount.bind(userController));

// Addresses
router.get("/me/addresses", userController.getAddresses.bind(userController));
router.post("/me/addresses", userController.addAddress.bind(userController));
router.patch(
  "/me/addresses/:id",
  userController.updateAddress.bind(userController)
);
router.delete(
  "/me/addresses/:id",
  userController.deleteAddress.bind(userController)
);
router.patch(
  "/me/addresses/:id/default",
  userController.setDefaultAddress.bind(userController)
);

// Orders (user)
router.get("/me/orders", userController.getOrders.bind(userController));
router.get("/me/orders/:id", userController.getOrderById.bind(userController));
router.patch(
  "/me/orders/:id/cancel",
  userController.cancelOrder.bind(userController)
);
router.post(
  "/me/orders/:id/return",
  userController.requestReturn.bind(userController)
);
router.get(
  "/me/orders/:id/invoice",
  userController.getInvoice.bind(userController)
);

// Wishlist
router.get("/me/wishlist", userController.getWishlist.bind(userController));
router.post(
  "/me/wishlist/:id",
  userController.addToWishlist.bind(userController)
);
router.delete(
  "/me/wishlist/:id",
  userController.removeFromWishlist.bind(userController)
);
router.delete(
  "/me/wishlist",
  userController.clearWishlist.bind(userController)
);
router.post(
  "/me/wishlist/:id/move-to-cart",
  userController.moveWishlistToCart.bind(userController)
);

// Notifications & Preferences
router.get(
  "/me/notifications",
  userController.getNotifications.bind(userController)
);
router.patch(
  "/me/notifications",
  userController.updateNotifications.bind(userController)
);
router.get("/me/activity", userController.getActivity.bind(userController));

// Reviews
router.get("/me/reviews", userController.getMyReviews.bind(userController));
router.patch(
  "/me/reviews/:id",
  userController.updateReview.bind(userController)
);
router.delete(
  "/me/reviews/:id",
  userController.deleteReview.bind(userController)
);

// Loyalty & Coupons
router.get("/me/loyalty", userController.getLoyalty.bind(userController));
router.get("/me/coupons", userController.getCoupons.bind(userController));

// Support
router.get("/me/tickets", userController.getTickets.bind(userController));
router.post("/me/tickets", userController.createTicket.bind(userController));
router.get(
  "/me/tickets/:id",
  userController.getTicketById.bind(userController)
);

// Admin sub-routes for user management
router.get(
  "/",
  authorizeRoles("admin"),
  userController.adminGetUsers.bind(userController)
);
router.get(
  "/:id",
  authorizeRoles("admin"),
  userController.adminGetUserById.bind(userController)
);
router.patch(
  "/:id/role",
  authorizeRoles("admin"),
  userController.adminUpdateRole.bind(userController)
);
router.patch(
  "/:id/ban",
  authorizeRoles("admin"),
  userController.adminBan.bind(userController)
);
router.patch(
  "/:id/unban",
  authorizeRoles("admin"),
  userController.adminUnban.bind(userController)
);
router.delete(
  "/:id",
  authorizeRoles("admin"),
  userController.adminDeleteUser.bind(userController)
);
router.get(
  "/:id/stats",
  authorizeRoles("admin"),
  userController.adminGetStats.bind(userController)
);
router.get(
  "/export/csv",
  authorizeRoles("admin"),
  userController.exportCsv.bind(userController)
);

export default router;
