import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../middleware/async.middleware";
import { StockAlertsController } from "./stock-alerts.controller";

const router = Router();
const controller = new StockAlertsController();

// Get user's stock alerts
router.get(
  "/",
  authMiddleware,
  asyncHandler(controller.getUserStockAlerts)
);

// Create stock alert
router.post(
  "/",
  authMiddleware,
  asyncHandler(controller.createStockAlert)
);

// Delete stock alert
router.delete(
  "/:productId",
  authMiddleware,
  asyncHandler(controller.deleteStockAlert)
);

export default router;

