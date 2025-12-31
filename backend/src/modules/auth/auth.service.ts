import { User } from "@prisma/client";
import {
  ERROR_MESSAGES,
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS,
} from "../../config/constants";
import { AnalyticsUtil, AnalyticsEventType } from "../../utils/analytics.util";
import { AuditLogUtil, AuditAction } from "../../utils/audit-log.util";
import { ConflictError, NotFoundError, UnauthorizedError, ValidationError } from "../../utils/error.util";
import { InputSanitizer } from "../../utils/input-sanitizer.util";
import { EmailUtil } from "../../utils/email.util";
import { WelcomeEmail } from "../../utils/email-templates";
import { JWTUtil } from "../../utils/jwt.util";
import { PasswordUtil } from "../../utils/password.util";
import { logger } from "../../utils/logger.util";
import { AuthRepository } from "./auth.repository";

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async register(
    data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    },
    ipAddress?: string,
    userAgent?: string
  ): Promise<{
    user: Omit<User, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    // Sanitize input
    const sanitizedData = {
      email: InputSanitizer.sanitizeEmail(data.email),
      password: data.password, // Don't sanitize password
      firstName: InputSanitizer.sanitizeString(data.firstName, { maxLength: 100 }),
      lastName: InputSanitizer.sanitizeString(data.lastName, { maxLength: 100 }),
      phone: data.phone ? InputSanitizer.sanitizePhone(data.phone) : undefined,
    };

    // Validate password strength
    const passwordValidation = InputSanitizer.validatePasswordStrength(sanitizedData.password);
    if (!passwordValidation.isValid) {
      throw new ValidationError(
        `Password validation failed: ${passwordValidation.errors.join(", ")}`
      );
    }

    const existingUser = await this.repository.findUserByEmail(sanitizedData.email);
    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await PasswordUtil.hash(sanitizedData.password);
    const user = await this.repository.createUser({
      ...sanitizedData,
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

    // Send welcome email with template
    try {
      await EmailUtil.sendEmail({
        to: user.email,
        subject: "Welcome to Valuva!",
        template: WelcomeEmail({
          customerName: `${user.firstName} ${user.lastName}`,
          dashboardUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`,
        }),
      });
    } catch (error) {
      // Don't fail registration if email fails
      logger.warn("Failed to send welcome email", {
        userId: user.id,
        email: user.email,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Track analytics
    AnalyticsUtil.trackEvent({
      userId: user.id,
      eventType: AnalyticsEventType.PAGE_VIEW,
      properties: { page: "registration" },
      ipAddress,
      userAgent,
    }).catch(() => {
      // Silently fail
    });

    // Audit log
    AuditLogUtil.logUserAction(
      user.id,
      AuditAction.CREATE,
      "User",
      user.id,
      { email: user.email },
      ipAddress,
      userAgent
    ).catch(() => {
      // Silently fail
    });

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

    const isPasswordValid = await PasswordUtil.compare(password, user.password || "");
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

  async verifyEmail(token: string): Promise<void> {
    const user = await this.repository.findUserByEmailVerificationToken(token);
    if (!user) {
      throw new UnauthorizedError("Invalid or expired verification token");
    }

    if (user.isEmailVerified) {
      throw new ConflictError("Email already verified");
    }

    await this.repository.verifyUserEmail(user.id);
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    const user = await this.repository.findUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.isEmailVerified) {
      throw new ConflictError("Email already verified");
    }

    const verificationToken = JWTUtil.generatePasswordResetToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hours expiry

    await this.repository.setEmailVerificationToken(
      user.id,
      verificationToken,
      expires
    );

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await EmailUtil.sendEmail(
      user.email,
      "Verify Your Email",
      `Click the link to verify your email: ${verificationUrl}`
    );
  }
}
