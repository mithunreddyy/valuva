import { User } from "@prisma/client";
import {
  ERROR_MESSAGES,
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS,
} from "../../config/constants";
import { EmailUtil } from "../../utils/email.util";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/error.util";
import { JWTUtil } from "../../utils/jwt.util";
import { PasswordUtil } from "../../utils/password.util";
import { AuthRepository } from "./auth.repository";

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{
    user: Omit<User, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingUser = await this.repository.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await PasswordUtil.hash(data.password);
    const user = await this.repository.createUser({
      ...data,
      password: hashedPassword,
    });

    const accessToken = JWTUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = JWTUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await this.repository.updateRefreshToken(user.id, refreshToken);

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    user: Omit<User, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.repository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated");
    }

    const isPasswordValid = await PasswordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const accessToken = JWTUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = JWTUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await this.repository.updateRefreshToken(user.id, refreshToken);
    await this.repository.updateLastLogin(user.id);

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = JWTUtil.verifyRefreshToken(refreshToken);
      const user = await this.repository.findUserById(decoded.userId);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN);
      }

      const newAccessToken = JWTUtil.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = JWTUtil.generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      await this.repository.updateRefreshToken(user.id, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }

  async logout(userId: string): Promise<void> {
    await this.repository.updateRefreshToken(userId, null);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.repository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const resetToken = JWTUtil.generatePasswordResetToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS);

    await this.repository.setPasswordResetToken(user.id, resetToken, expires);

    await EmailUtil.sendEmail(
      user.email,
      "Password Reset",
      `Click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.repository.findUserByResetToken(token);
    if (!user) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    const hashedPassword = await PasswordUtil.hash(newPassword);
    await this.repository.updatePassword(user.id, hashedPassword);
  }
}
