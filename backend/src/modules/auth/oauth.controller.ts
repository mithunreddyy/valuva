import { Request, Response } from "express";
import { OAuthService, OAuthProfile } from "./oauth.service";
import { logger } from "../../utils/logger.util";
import { UnauthorizedError } from "../../utils/error.util";

export class OAuthController {
  private oauthService: OAuthService;

  constructor() {
    this.oauthService = new OAuthService();
  }

  handleOAuthCallback = async (req: Request, res: Response) => {
    try {
      const profile = req.user as OAuthProfile;

      if (!profile) {
        logger.warn("OAuth callback: No profile found", {
          user: req.user,
          session: req.session,
        });
        throw new UnauthorizedError("OAuth authentication failed");
      }

      if (!profile.email) {
        logger.warn("OAuth callback: No email in profile", { profile });
        throw new UnauthorizedError("Email is required for authentication");
      }

      logger.info("OAuth callback: Processing profile", {
        provider: profile.provider,
        email: profile.email,
      });

      const result = await this.oauthService.findOrCreateUser(profile);

      // Production-ready: Fail if FRONTEND_URL is not configured
      const frontendUrl = process.env.FRONTEND_URL;
      if (!frontendUrl && process.env.NODE_ENV === "production") {
        logger.error("FRONTEND_URL environment variable is required in production");
        return res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      }
      const frontendUrlFinal = frontendUrl || "http://localhost:3000";
      const redirectUrl = new URL(`${frontendUrlFinal}/auth/callback`);
      redirectUrl.searchParams.set("accessToken", result.accessToken);
      redirectUrl.searchParams.set("refreshToken", result.refreshToken);
      redirectUrl.searchParams.set("success", "true");

      logger.info("OAuth callback: Success", {
        provider: profile.provider,
        userId: result.user.id,
      });

      return res.redirect(redirectUrl.toString());
    } catch (error: any) {
      logger.error("OAuth callback error", {
        error: error.message,
        stack: error.stack,
        user: req.user,
      });

      const frontendUrl = process.env.FRONTEND_URL;
      if (!frontendUrl && process.env.NODE_ENV === "production") {
        logger.error("FRONTEND_URL environment variable is required in production");
        return res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      }
      const frontendUrlFinal = frontendUrl || "http://localhost:3000";
      const redirectUrl = new URL(`${frontendUrlFinal}/auth/callback`);
      redirectUrl.searchParams.set("success", "false");
      redirectUrl.searchParams.set(
        "error",
        encodeURIComponent(error.message || "Authentication failed")
      );
      return res.redirect(redirectUrl.toString());
    }
  };
}

