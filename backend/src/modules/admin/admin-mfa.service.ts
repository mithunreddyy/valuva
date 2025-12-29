import { authenticator } from "otplib";
import * as QRCode from "qrcode";
import { ERROR_MESSAGES } from "../../config/constants";
import { prisma } from "../../config/database";
import { NotFoundError, UnauthorizedError } from "../../utils/error.util";
import { PasswordUtil } from "../../utils/password.util";

export class AdminMFAService {
  /**
   * Generate MFA secret and QR code for admin
   */
  async setupMFA(adminId: string) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundError("Admin not found");
    }

    // Generate secret
    const secret = authenticator.generateSecret();
    const serviceName = "Valuva Admin";
    const accountName = `${admin.firstName} ${admin.lastName} (${admin.email})`;

    // Generate OTP Auth URL
    const otpAuthUrl = authenticator.keyuri(accountName, serviceName, secret);

    // Generate QR Code
    const qrCode = await QRCode.toDataURL(otpAuthUrl);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    // Store secret temporarily (will be saved after verification)
    // In production, you might want to store this in Redis with expiration

    return {
      secret,
      qrCode,
      backupCodes,
      otpAuthUrl,
    };
  }

  /**
   * Verify MFA setup and enable it
   */
  async verifyAndEnableMFA(
    adminId: string,
    token: string,
    secret: string,
    backupCodes: string[]
  ) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundError("Admin not found");
    }

    // Verify token
    const isValid = authenticator.verify({
      token,
      secret,
    });

    if (!isValid) {
      throw new UnauthorizedError("Invalid MFA token");
    }

    // Hash backup codes before storing
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => PasswordUtil.hash(code))
    );

    // Enable MFA
    await prisma.admin.update({
      where: { id: adminId },
      data: {
        mfaEnabled: true,
        mfaSecret: secret,
        backupCodes: hashedBackupCodes,
      } as any, // Type assertion - Prisma types will update after migration
    });

    return { success: true };
  }

  /**
   * Verify MFA token during login
   */
  async verifyMFAToken(adminId: string, token: string): Promise<boolean> {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return false;
    }

    // Type assertion for MFA fields
    const adminWithMFA = admin as typeof admin & {
      mfaEnabled?: boolean;
      mfaSecret?: string | null;
      backupCodes?: string[];
    };

    if (adminWithMFA.mfaEnabled !== true || !adminWithMFA.mfaSecret) {
      return false;
    }

    // Check TOTP token
    const isValidTOTP = authenticator.verify({
      token,
      secret: adminWithMFA.mfaSecret,
    });

    if (isValidTOTP) {
      return true;
    }

    // Check backup codes
    if (adminWithMFA.backupCodes && adminWithMFA.backupCodes.length > 0) {
      for (let i = 0; i < adminWithMFA.backupCodes.length; i++) {
        const isValidBackup = await PasswordUtil.compare(
          token,
          adminWithMFA.backupCodes[i]
        );
        if (isValidBackup) {
          // Remove used backup code
          const updatedBackupCodes = [...adminWithMFA.backupCodes];
          updatedBackupCodes.splice(i, 1);
          await prisma.admin.update({
            where: { id: adminId },
            data: { backupCodes: updatedBackupCodes } as any, // Type assertion - Prisma types will update after migration
          });
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Disable MFA for admin
   */
  async disableMFA(adminId: string, password: string) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundError("Admin not found");
    }

    // Verify password
    const isValidPassword = await PasswordUtil.compare(
      password,
      admin.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Disable MFA
    await prisma.admin.update({
      where: { id: adminId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        backupCodes: [],
      } as any, // Type assertion - Prisma types will update after migration
    });

    return { success: true };
  }

  /**
   * Generate new backup codes
   */
  async regenerateBackupCodes(adminId: string) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundError("Admin not found");
    }

    // Type assertion for MFA fields
    const adminWithMFA = admin as typeof admin & {
      mfaEnabled?: boolean;
    };

    if (!adminWithMFA.mfaEnabled) {
      throw new NotFoundError("MFA not enabled");
    }

    const backupCodes = this.generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => PasswordUtil.hash(code))
    );

    await prisma.admin.update({
      where: { id: adminId },
      data: {
        backupCodes: hashedBackupCodes,
      } as any, // Type assertion - Prisma types will update after migration
    });

    return { backupCodes };
  }

  /**
   * Generate 10 backup codes
   */
  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generate 8-character alphanumeric code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }
}
