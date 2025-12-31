import { UsersRepository } from "../../modules/users/users.repository";
import { UsersService } from "../../modules/users/users.service";

// Mock dependencies
jest.mock("../../modules/users/users.repository");
jest.mock("../../utils/password.util");

import { PasswordUtil } from "../../utils/password.util";

describe("UsersService", () => {
  let service: UsersService;
  let mockRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    mockRepository = {
      getUserById: jest.fn(),
      updateProfile: jest.fn(),
      getUserByIdWithPassword: jest.fn(),
      updatePassword: jest.fn(),
      getUserStats: jest.fn(),
      getAllUsers: jest.fn(),
      getUserDetails: jest.fn(),
      updateUserStatus: jest.fn(),
    } as any;

    (UsersRepository as jest.Mock).mockImplementation(() => mockRepository);
    service = new UsersService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      };

      mockRepository.getUserById.mockResolvedValue(mockUser as any);

      const result = await service.getProfile("1");

      expect(result).toEqual(mockUser);
      expect(mockRepository.getUserById).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundError if user not found", async () => {
      mockRepository.getUserById.mockResolvedValue(null);

      await expect(service.getProfile("nonexistent")).rejects.toThrow("User not found");
    });
  });

  describe("updateProfile", () => {
    it("should update user profile", async () => {
      const userId = "1";
      const updateData = {
        firstName: "Updated",
        lastName: "Name",
      };

      const mockUser = {
        id: userId,
        email: "test@example.com",
        ...updateData,
      };

      mockRepository.getUserById.mockResolvedValue(mockUser as any);
      mockRepository.updateProfile.mockResolvedValue(mockUser as any);

      const result = await service.updateProfile(userId, updateData);

      expect(result).toEqual(mockUser);
      expect(mockRepository.updateProfile).toHaveBeenCalledWith(userId, updateData);
    });

    it("should throw NotFoundError if user not found", async () => {
      mockRepository.getUserById.mockResolvedValue(null);

      await expect(service.updateProfile("nonexistent", {})).rejects.toThrow("User not found");
    });
  });

  describe("changePassword", () => {
    it("should change password successfully", async () => {
      const userId = "1";
      const currentPassword = "OldPassword123!";
      const newPassword = "NewPassword123!";

      const mockUser = {
        id: userId,
        email: "test@example.com",
        password: "hashedOldPassword",
      };

      mockRepository.getUserByIdWithPassword.mockResolvedValue(mockUser as any);
      (PasswordUtil.compare as jest.Mock).mockResolvedValue(true);
      (PasswordUtil.hash as jest.Mock).mockResolvedValue("hashedNewPassword");
      mockRepository.updatePassword.mockResolvedValue(undefined as any);

      await service.changePassword(userId, currentPassword, newPassword);

      expect(PasswordUtil.compare).toHaveBeenCalledWith(currentPassword, mockUser.password);
      expect(PasswordUtil.hash).toHaveBeenCalledWith(newPassword);
      expect(mockRepository.updatePassword).toHaveBeenCalledWith(userId, "hashedNewPassword");
    });

    it("should throw NotFoundError if user not found", async () => {
      mockRepository.getUserByIdWithPassword.mockResolvedValue(null);

      await expect(
        service.changePassword("nonexistent", "old", "new")
      ).rejects.toThrow("User not found");
    });

    it("should throw UnauthorizedError if current password is incorrect", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
      };

      mockRepository.getUserByIdWithPassword.mockResolvedValue(mockUser as any);
      (PasswordUtil.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword("1", "wrongPassword", "newPassword")
      ).rejects.toThrow("Current password is incorrect");
    });
  });

  describe("getUserStats", () => {
    it("should return user stats", async () => {
      const userId = "1";
      const mockUser = { id: userId };
      const mockStats = {
        totalOrders: 5,
        totalSpent: 1000,
        totalReviews: 3,
      };

      mockRepository.getUserById.mockResolvedValue(mockUser as any);
      mockRepository.getUserStats.mockResolvedValue(mockStats as any);

      const result = await service.getUserStats(userId);

      expect(result).toEqual(mockStats);
      expect(mockRepository.getUserStats).toHaveBeenCalledWith(userId);
    });

    it("should throw NotFoundError if user not found", async () => {
      mockRepository.getUserById.mockResolvedValue(null);

      await expect(service.getUserStats("nonexistent")).rejects.toThrow("User not found");
    });
  });

  describe("getAllUsers", () => {
    it("should return paginated users", async () => {
      const mockUsers = [
        { id: "1", email: "user1@example.com" },
        { id: "2", email: "user2@example.com" },
      ];
      const total = 2;

      mockRepository.getAllUsers.mockResolvedValue({
        users: mockUsers as any,
        total,
      });

      const result = await service.getAllUsers(1, 10);

      expect(result.users).toEqual(mockUsers);
      expect(result.total).toBe(total);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe("getUserDetails", () => {
    it("should return user details", async () => {
      const userId = "1";
      const mockUserDetails = {
        id: userId,
        email: "test@example.com",
        orders: [],
        addresses: [],
      };

      mockRepository.getUserDetails.mockResolvedValue(mockUserDetails as any);

      const result = await service.getUserDetails(userId);

      expect(result).toEqual(mockUserDetails);
    });

    it("should throw NotFoundError if user not found", async () => {
      mockRepository.getUserDetails.mockResolvedValue(null);

      await expect(service.getUserDetails("nonexistent")).rejects.toThrow("User not found");
    });
  });

  describe("updateUserStatus", () => {
    it("should update user status", async () => {
      const userId = "1";
      const mockUser = {
        id: userId,
        isActive: true,
      };

      mockRepository.getUserById.mockResolvedValue(mockUser as any);
      mockRepository.updateUserStatus.mockResolvedValue({
        ...mockUser,
        isActive: false,
      } as any);

      const result = await service.updateUserStatus(userId, false);

      expect(result.isActive).toBe(false);
      expect(mockRepository.updateUserStatus).toHaveBeenCalledWith(userId, false);
    });

    it("should throw NotFoundError if user not found", async () => {
      mockRepository.getUserById.mockResolvedValue(null);

      await expect(service.updateUserStatus("nonexistent", true)).rejects.toThrow(
        "User not found"
      );
    });
  });
});

