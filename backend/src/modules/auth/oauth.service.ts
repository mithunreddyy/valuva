import { prisma } from "../../config/database";
import { JWTUtil } from "../../utils/jwt.util";

export interface OAuthProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  provider: "google" | "apple";
}

export class OAuthService {
  async findOrCreateUser(profile: OAuthProfile): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
  }> {
    // Check if OAuth account exists
    const existingOAuthAccount = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider: profile.provider,
          providerId: profile.id,
        },
      },
      include: { user: true },
    });

    if (existingOAuthAccount) {
      // Update OAuth account info
      await prisma.oAuthAccount.update({
        where: { id: existingOAuthAccount.id },
        data: {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          picture: profile.picture,
          updatedAt: new Date(),
        },
      });

      const user = existingOAuthAccount.user;
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date(), isEmailVerified: true },
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

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      };
    }

    // Check if user with email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (existingUser) {
      // Link OAuth account to existing user
      await prisma.oAuthAccount.create({
        data: {
          userId: existingUser.id,
          provider: profile.provider,
          providerId: profile.id,
          email: profile.email,
          firstName: profile.firstName || existingUser.firstName,
          lastName: profile.lastName || existingUser.lastName,
          picture: profile.picture,
        },
      });

      await prisma.user.update({
        where: { id: existingUser.id },
        data: { lastLogin: new Date(), isEmailVerified: true },
      });

      const accessToken = JWTUtil.generateAccessToken({
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      });

      const refreshToken = JWTUtil.generateRefreshToken({
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      });

      await prisma.user.update({
        where: { id: existingUser.id },
        data: { refreshToken },
      });

      const { password: _, ...userWithoutPassword } = existingUser;

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      };
    }

    // Create new user with OAuth account
    const names = this.parseName(profile.firstName, profile.lastName);
    const newUser = await prisma.user.create({
      data: {
        email: profile.email,
        firstName: names.firstName,
        lastName: names.lastName,
        password: "", // Empty password for OAuth users
        isEmailVerified: true,
        isActive: true,
      },
    });

    await prisma.oAuthAccount.create({
      data: {
        userId: newUser.id,
        provider: profile.provider,
        providerId: profile.id,
        email: profile.email,
        firstName: names.firstName,
        lastName: names.lastName,
        picture: profile.picture,
      },
    });

    await prisma.user.update({
      where: { id: newUser.id },
      data: { lastLogin: new Date() },
    });

    const accessToken = JWTUtil.generateAccessToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const refreshToken = JWTUtil.generateRefreshToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  private parseName(
    firstName?: string,
    lastName?: string
  ): {
    firstName: string;
    lastName: string;
  } {
    if (firstName && lastName) {
      return { firstName, lastName };
    }

    if (firstName && !lastName) {
      const parts = firstName.trim().split(" ");
      if (parts.length > 1) {
        return {
          firstName: parts[0],
          lastName: parts.slice(1).join(" "),
        };
      }
      return { firstName: parts[0], lastName: "" };
    }

    return { firstName: "User", lastName: "" };
  }
}
