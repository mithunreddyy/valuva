// File: src/routes/checkout.routes.ts
import { Router } from "express";
import { checkoutController } from "../controllers/checkout.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

// Guest & Auth mixed
router.get(
  "/summary",
  authenticateJWT,
  checkoutController.summary.bind(checkoutController)
);
router.get(
  "/validate",
  authenticateJWT,
  checkoutController.validate.bind(checkoutController)
);

router.get(
  "/addresses",
  authenticateJWT,
  checkoutController.addresses.bind(checkoutController)
);
router.post(
  "/shipping/calculate",
  authenticateJWT,
  checkoutController.calculateShipping.bind(checkoutController)
);
router.get(
  "/shipping/methods",
  authenticateJWT,
  checkoutController.getMethods.bind(checkoutController)
);
router.post(
  "/address/verify",
  authenticateJWT,
  checkoutController.verifyAddress.bind(checkoutController)
);

router.get(
  "/coupons",
  authenticateJWT,
  checkoutController.coupons.bind(checkoutController)
);
router.post(
  "/coupon/apply",
  authenticateJWT,
  checkoutController.applyCoupon.bind(checkoutController)
);
router.delete(
  "/coupon/remove",
  authenticateJWT,
  checkoutController.removeCoupon.bind(checkoutController)
);
router.post(
  "/loyalty/apply",
  authenticateJWT,
  checkoutController.applyLoyalty.bind(checkoutController)
);

router.get(
  "/payment/methods",
  authenticateJWT,
  checkoutController.paymentMethods.bind(checkoutController)
);
router.post(
  "/payment/select",
  authenticateJWT,
  checkoutController.selectPayment.bind(checkoutController)
);
router.get(
  "/payment/saved",
  authenticateJWT,
  checkoutController.savedPayment.bind(checkoutController)
);
router.post(
  "/payment/verify",
  authenticateJWT,
  checkoutController.verifyPaymentEndpoint.bind(checkoutController)
);

router.get(
  "/final-summary",
  authenticateJWT,
  checkoutController.finalSummary.bind(checkoutController)
);
router.post(
  "/initiate",
  authenticateJWT,
  checkoutController.initiate.bind(checkoutController)
);
router.post(
  "/place-order",
  authenticateJWT,
  checkoutController.placeOrder.bind(checkoutController)
);
router.post(
  "/verify-payment",
  authenticateJWT,
  checkoutController.verifyPaymentEndpoint.bind(checkoutController)
);

router.get(
  "/confirmation/:id",
  authenticateJWT,
  checkoutController.confirmation.bind(checkoutController)
);
router.post(
  "/confirmation/:id/email",
  authenticateJWT,
  checkoutController.emailConfirmation.bind(checkoutController)
);

router.post(
  "/save-state",
  authenticateJWT,
  checkoutController.saveState.bind(checkoutController)
);
router.get(
  "/resume",
  authenticateJWT,
  checkoutController.resume.bind(checkoutController)
);
router.post(
  "/delivery-estimate",
  authenticateJWT,
  checkoutController.deliveryEstimate.bind(checkoutController)
);
router.post(
  "/cod/check",
  authenticateJWT,
  checkoutController.codCheck.bind(checkoutController)
);
router.get(
  "/tax/breakdown",
  authenticateJWT,
  checkoutController.taxBreakdown.bind(checkoutController)
);
router.post(
  "/giftcard/apply",
  authenticateJWT,
  checkoutController.applyGiftcard.bind(checkoutController)
);
router.delete(
  "/giftcard/remove",
  authenticateJWT,
  checkoutController.removeGiftcard.bind(checkoutController)
);

// Guest checkout
router.post(
  "/guest/initialize",
  checkoutController.guestInitialize.bind(checkoutController)
);
router.post(
  "/guest/place-order",
  checkoutController.guestPlaceOrder.bind(checkoutController)
);
router.get(
  "/guest/track/:id/:email",
  checkoutController.guestTrack.bind(checkoutController)
);

router.post(
  "/save-cart",
  authenticateJWT,
  checkoutController.saveCart.bind(checkoutController)
);
router.get(
  "/abandoned-cart",
  authenticateJWT,
  checkoutController.getAbandoned.bind(checkoutController)
);
router.get(
  "/analytics/funnel",
  authenticateJWT,
  checkoutController.funnelAnalytics.bind(checkoutController)
);

export default router;
