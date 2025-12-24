import { User } from "@prisma/client";
import { prisma } from "../../config/database";

export class AuthRepository {
  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async updateLastLogin(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  async setPasswordResetToken(
    userId: string,
    token: string,
    expires: Date
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });
  }

  async findUserByResetToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });
  }

  async updatePassword(userId: string, password: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        password,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }
}
