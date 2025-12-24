import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class JWTUtil {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET as string, {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET as string, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    });
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET as string) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET as string) as TokenPayload;
  }

  static generatePasswordResetToken(): string {
    return jwt.sign({}, env.JWT_SECRET as string, {
      expiresIn: "1h" as SignOptions["expiresIn"],
    });
  }
}
