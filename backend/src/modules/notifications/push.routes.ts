import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { PushNotificationController } from "./push.controller";

const router = Router();
const controller = new PushNotificationController();

/**
 * @swagger
 * /api/v1/notifications/push/subscribe:
 *   post:
 *     summary: Subscribe to push notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.post("/subscribe", authenticate, controller.subscribe);

/**
 * @swagger
 * /api/v1/notifications/push/unsubscribe:
 *   post:
 *     summary: Unsubscribe from push notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.post("/unsubscribe", authenticate, controller.unsubscribe);

/**
 * @swagger
 * /api/v1/notifications/push/vapid-key:
 *   get:
 *     summary: Get VAPID public key
 *     tags: [Notifications]
 */
router.get("/vapid-key", controller.getVapidKey);

export default router;

