import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { validate } from "../../middleware/validate.middleware";
import { PaymentsController } from "./payments.controller";
import {
  confirmPaymentSchema,
  paymentWebhookSchema,
} from "./payments.validation";

const router = Router();
const controller = new PaymentsController();

// Webhook endpoint (no auth, validated by secret at gateway level in real setups)
router.post(
  "/webhook",
  validate(paymentWebhookSchema),
  asyncHandler(controller.webhook)
);

// Confirm payment for an order (e.g., after client-side gateway success)
router.post(
  "/:orderId/confirm",
  validate(confirmPaymentSchema),
  asyncHandler(controller.confirmPayment)
);

export default router;


