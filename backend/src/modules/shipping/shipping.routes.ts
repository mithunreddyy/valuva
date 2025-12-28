import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { ShippingController } from "./shipping.controller";

const router = Router();
const controller = new ShippingController();

router.post("/calculate-rate", asyncHandler(controller.calculateRate));
router.get("/track/:trackingNumber", asyncHandler(controller.trackShipment));

export default router;

