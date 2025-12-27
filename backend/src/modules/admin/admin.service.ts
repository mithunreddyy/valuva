import { OrderStatus } from "@prisma/client";
import { ERROR_MESSAGES } from "../../config/constants";
import { UnauthorizedError } from "../../utils/error.util";
import { JWTUtil } from "../../utils/jwt.util";
import { PasswordUtil } from "../../utils/password.util";
import { AdminRepository } from "./admin.repository";

export class AdminService {
  private repository: AdminRepository;

  constructor() {
    this.repository = new AdminRepository();
  }
  async login(email: string, password: string) {
    const admin = await this.repository.findAdminByEmail(email);

    if (!admin || !admin.isActive) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isValid = await PasswordUtil.compare(password, admin.password);
    if (!isValid) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const accessToken = JWTUtil.generateAccessToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const refreshToken = JWTUtil.generateRefreshToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    await this.repository.updateAdminLogin(admin.id, refreshToken);

    const { password: _, ...adminData } = admin;

    return { admin: adminData, accessToken, refreshToken };
  }

  async getDashboardStats() {
    const overview = await this.repository.getDashboardOverview();
    const recentOrders = await this.repository.getRecentOrders(10);
    const topProducts = await this.repository.getTopProducts(10);

    return {
      overview,
      recentOrders,
      topProducts,
    };
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ) {
    return this.repository.updateOrderStatus(orderId, status, trackingNumber);
  }

  async getOrders(page: number, limit: number) {
    const skip = (page - 1) * limit;

    return this.repository.getOrders(skip, limit);
  }

  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    return this.repository.getUsers(skip, limit);
  }

  async getOrderById(orderId: string) {
    return this.repository.getOrderById(orderId);
  }
}
