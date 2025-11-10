// File: src/routes/index.ts
import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import cartRoutes from "./cart.routes";
import userRoutes from "./user.routes";
import checkoutRoutes from "./checkout.routes";
import orderRoutes from "./order.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/users", userRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/orders", orderRoutes);
router.use("/admin", adminRoutes);

export default router;
