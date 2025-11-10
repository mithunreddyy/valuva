// File: src/routes/admin.routes.ts
import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticateJWT, authorizeRoles("admin"));

router.get("/dashboard", adminController.dashboard.bind(adminController));
router.get("/analytics", adminController.analytics.bind(adminController));
router.get("/users", adminController.users.bind(adminController));
router.get("/products", adminController.products.bind(adminController));
router.get("/orders", adminController.orders.bind(adminController));
router.get("/settings", adminController.settings.bind(adminController));

export default router;
