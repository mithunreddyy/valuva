import { AuthRepository } from "../../modules/auth/auth.repository";
import { AuthService } from "../../modules/auth/auth.service";

// Mock dependencies
jest.mock("../../modules/auth/auth.repository");
jest.mock("../../utils/password.util");
jest.mock("../../utils/jwt.util");
jest.mock("../../utils/email.util");
jest.mock("../../utils/input-sanitizer.util");
jest.mock("../../utils/analytics.util");
jest.mock("../../utils/audit-log.util");

import { PasswordUtil } from "../../utils/password.util";
import { JWTUtil } from "../../utils/jwt.util";
import { EmailUtil } from "../../utils/email.util";
import { InputSanitizer } from "../../utils/input-sanitizer.util";
import { NotFoundError, UnauthorizedError } from "../../utils/error.util";

describe("AuthService", () => {
  let service: AuthService;
  let mockRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockRepository = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
      updateRefreshToken: jest.fn(),
      findUserById: jest.fn(),
      updateLastLogin: jest.fn(),
      setPasswordResetToken: jest.fn(),
      findUserByResetToken: jest.fn(),
      updatePassword: jest.fn(),
      findUserByEmailVerificationToken: jest.fn(),
      verifyUserEmail: jest.fn(),
      setEmailVerificationToken: jest.fn(),
    } as any;

    (AuthRepository as jest.Mock).mockImplementation(() => mockRepository);
    service = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const registerData = {
        email: "test@example.com",
        password: "Test123!@#",
        firstName: "Test",
        lastName: "User",
      };

      const mockUser = {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        password: "hashedPassword",
        role: "USER",
        isActive: true,
        isEmailVerified: false,
      };

      (InputSanitizer.sanitizeEmail as jest.Mock).mockReturnValue(registerData.email);
      (InputSanitizer.sanitizeString as jest.Mock).mockImplementation((str) => str);
      (InputSanitizer.validatePasswordStrength as jest.Mock).mockReturnValue({
        isValid: true,
        errors: [],
      });
      (PasswordUtil.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (JWTUtil.generateAccessToken as jest.Mock).mockReturnValue("accessToken");
      (JWTUtil.generateRefreshToken as jest.Mock).mockReturnValue("refreshToken");
      (EmailUtil.sendEmail as jest.Mock).mockResolvedValue(undefined);

      mockRepository.findUserByEmail.mockResolvedValue(null);
      mockRepository.createUser.mockResolvedValue(mockUser as any);
      mockRepository.updateRefreshToken.mockResolvedValue(undefined as any);

      const result = await service.register(registerData);

      expect(result.user.email).toBe(registerData.email);
      expect(result.accessToken).toBe("accessToken");
      expect(result.refreshToken).toBe("refreshToken");
      expect(mockRepository.createUser).toHaveBeenCalled();
      expect(mockRepository.updateRefreshToken).toHaveBeenCalled();
    });

    it("should throw ConflictError if email already exists", async () => {
      const registerData = {
        email: "existing@example.com",
        password: "Test123!@#",
        firstName: "Test",
        lastName: "User",
      };

      const existingUser = {
        id: "1",
        email: "existing@example.com",
      };

      (InputSanitizer.sanitizeEmail as jest.Mock).mockReturnValue(registerData.email);
      (InputSanitizer.sanitizeString as jest.Mock).mockImplementation((str) => str);
      (InputSanitizer.validatePasswordStrength as jest.Mock).mockReturnValue({
        isValid: true,
        errors: [],
      });

      mockRepository.findUserByEmail.mockResolvedValue(existingUser as any);

      await expect(service.register(registerData)).rejects.toThrow();
    });

    it("should throw ValidationError if password is weak", async () => {
      const registerData = {
        email: "test@example.com",
        password: "weak",
        firstName: "Test",
        lastName: "User",
      };

      (InputSanitizer.sanitizeEmail as jest.Mock).mockReturnValue(registerData.email);
      (InputSanitizer.sanitizeString as jest.Mock).mockImplementation((str) => str);
      (InputSanitizer.validatePasswordStrength as jest.Mock).mockReturnValue({
        isValid: false,
        errors: ["Password too short"],
      });

      mockRepository.findUserByEmail.mockResolvedValue(null);

      await expect(service.register(registerData)).rejects.toThrow();
    });
  });

  describe("login", () => {
    it("should login user with valid credentials", async () => {
      const email = "test@example.com";
      const password = "Test123!@#";

      const mockUser = {
        id: "1",
        email,
        password: "hashedPassword",
        role: "USER",
        isActive: true,
      };

      mockRepository.findUserByEmail.mockResolvedValue(mockUser as any);
      (PasswordUtil.compare as jest.Mock).mockResolvedValue(true);
      (JWTUtil.generateAccessToken as jest.Mock).mockReturnValue("accessToken");
      (JWTUtil.generateRefreshToken as jest.Mock).mockReturnValue("refreshToken");
      mockRepository.updateRefreshToken.mockResolvedValue(undefined as any);
      mockRepository.updateLastLogin.mockResolvedValue(undefined as any);

      const result = await service.login(email, password);

      expect(result.user.email).toBe(email);
      expect(result.accessToken).toBe("accessToken");
      expect(result.refreshToken).toBe("refreshToken");
      expect(PasswordUtil.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it("should throw UnauthorizedError if user not found", async () => {
      mockRepository.findUserByEmail.mockResolvedValue(null);

      await expect(service.login("test@example.com", "password")).rejects.toThrow(
        UnauthorizedError
      );
    });

    it("should throw UnauthorizedError if password is incorrect", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        isActive: true,
      };

      mockRepository.findUserByEmail.mockResolvedValue(mockUser as any);
      (PasswordUtil.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login("test@example.com", "wrongPassword")).rejects.toThrow(
        UnauthorizedError
      );
    });

    it("should throw UnauthorizedError if account is deactivated", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        isActive: false,
      };

      mockRepository.findUserByEmail.mockResolvedValue(mockUser as any);

      await expect(service.login("test@example.com", "password")).rejects.toThrow(
        UnauthorizedError
      );
    });
  });

  describe("refreshToken", () => {
    it("should refresh tokens successfully", async () => {
      const refreshToken = "validRefreshToken";
      const mockUser = {
        id: "1",
        email: "test@example.com",
        refreshToken: "validRefreshToken",
        role: "USER",
      };

      (JWTUtil.verifyRefreshToken as jest.Mock).mockReturnValue({ userId: "1" });
      mockRepository.findUserById.mockResolvedValue(mockUser as any);
      (JWTUtil.generateAccessToken as jest.Mock).mockReturnValue("newAccessToken");
      (JWTUtil.generateRefreshToken as jest.Mock).mockReturnValue("newRefreshToken");
      mockRepository.updateRefreshToken.mockResolvedValue(undefined as any);

      const result = await service.refreshToken(refreshToken);

      expect(result.accessToken).toBe("newAccessToken");
      expect(result.refreshToken).toBe("newRefreshToken");
    });

    it("should throw UnauthorizedError if token is invalid", async () => {
      (JWTUtil.verifyRefreshToken as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(service.refreshToken("invalidToken")).rejects.toThrow();
    });

    it("should throw UnauthorizedError if user not found", async () => {
      (JWTUtil.verifyRefreshToken as jest.Mock).mockReturnValue({ userId: "1" });
      mockRepository.findUserById.mockResolvedValue(null);

      await expect(service.refreshToken("token")).rejects.toThrow();
    });
  });

  describe("logout", () => {
    it("should clear refresh token", async () => {
      mockRepository.updateRefreshToken.mockResolvedValue(undefined as any);

      await service.logout("userId");

      expect(mockRepository.updateRefreshToken).toHaveBeenCalledWith("userId", null);
    });
  });

  describe("forgotPassword", () => {
    it("should send password reset email", async () => {
      const email = "test@example.com";
      const mockUser = {
        id: "1",
        email,
      };

      mockRepository.findUserByEmail.mockResolvedValue(mockUser as any);
      (JWTUtil.generatePasswordResetToken as jest.Mock).mockReturnValue("resetToken");
      mockRepository.setPasswordResetToken.mockResolvedValue(undefined as any);
      (EmailUtil.sendEmail as jest.Mock).mockResolvedValue(undefined);

      await service.forgotPassword(email);

      expect(mockRepository.setPasswordResetToken).toHaveBeenCalled();
      expect(EmailUtil.sendEmail).toHaveBeenCalled();
    });

    it("should throw NotFoundError if user not found", async () => {
      mockRepository.findUserByEmail.mockResolvedValue(null);

      await expect(service.forgotPassword("nonexistent@example.com")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("resetPassword", () => {
    it("should reset password successfully", async () => {
      const token = "validToken";
      const newPassword = "NewPassword123!";
      const mockUser = {
        id: "1",
        email: "test@example.com",
      };

      mockRepository.findUserByResetToken.mockResolvedValue(mockUser as any);
      (PasswordUtil.hash as jest.Mock).mockResolvedValue("hashedPassword");
      mockRepository.updatePassword.mockResolvedValue(undefined as any);

      await service.resetPassword(token, newPassword);

      expect(PasswordUtil.hash).toHaveBeenCalledWith(newPassword);
      expect(mockRepository.updatePassword).toHaveBeenCalled();
    });

    it("should throw UnauthorizedError if token is invalid", async () => {
      mockRepository.findUserByResetToken.mockResolvedValue(null);

      await expect(service.resetPassword("invalidToken", "newPassword")).rejects.toThrow(
        UnauthorizedError
      );
    });
  });
});

