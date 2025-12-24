import { NotFoundError, UnauthorizedError } from "../../utils/error.util";
import { PasswordUtil } from "../../utils/password.util";
import { UsersRepository } from "./users.repository";

export class UsersService {
  private repository: UsersRepository;

  constructor() {
    this.repository = new UsersRepository();
  }

  async getProfile(userId: string) {
    const user = await this.repository.getUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  async updateProfile(userId: string, data: any) {
    const user = await this.repository.getUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return this.repository.updateProfile(userId, data);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await this.repository.getUserByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isValid = await PasswordUtil.compare(currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    const hashedPassword = await PasswordUtil.hash(newPassword);
    await this.repository.updatePassword(userId, hashedPassword);
  }

  async getUserStats(userId: string) {
    const user = await this.repository.getUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return this.repository.getUserStats(userId);
  }

  async getAllUsers(page: number, limit: number, filters?: any) {
    const skip = (page - 1) * limit;
    const { users, total } = await this.repository.getAllUsers(
      skip,
      limit,
      filters
    );
    return { users, total, page, limit };
  }

  async getUserDetails(userId: string) {
    const user = await this.repository.getUserDetails(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    const user = await this.repository.getUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return this.repository.updateUserStatus(userId, isActive);
  }
}
