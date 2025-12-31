import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../../config/env";
import { asyncHandler } from "../../middleware/async.middleware";
import { OAuthController } from "./oauth.controller";

const router = Router();
const controller = new OAuthController();

// Type definition for OAuthProfile
interface OAuthProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  provider: "google" | "apple";
}

// Configure Passport serialization
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Configure Google OAuth Strategy
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          env.GOOGLE_CALLBACK_URL || "/api/v1/auth/oauth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const oauthProfile: OAuthProfile = {
            id: profile.id,
            email: profile.emails?.[0]?.value || "",
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            picture: profile.photos?.[0]?.value,
            provider: "google",
          };

          return done(null, oauthProfile);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
}

// Configure Apple OAuth Strategy (simplified - requires additional setup)
// Apple Sign In requires more complex setup with JWT tokens
// This is a placeholder that can be expanded

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  asyncHandler(controller.handleOAuthCallback)
);

// Apple OAuth Routes (placeholder - requires additional implementation)
router.get(
  "/apple",
  asyncHandler(async (_req, res) => {
    // Apple Sign In requires client-side implementation
    // This endpoint can be used for server-side verification
    res.status(501).json({
      success: false,
      message: "Apple Sign In requires additional setup",
    });
  })
);

router.post(
  "/apple/callback",
  asyncHandler(async (req, res) => {
    // Handle Apple Sign In callback
    // Apple uses POST requests for callbacks
    const { identityToken, user } = req.body;

    if (!identityToken) {
      return res.status(400).json({
        success: false,
        message: "Missing identity token",
      });
    }

    try {
      // Verify Apple identity token
      const { verifyAppleIdentityToken } = await import("./apple-oauth.util");
      const applePayload = await verifyAppleIdentityToken(identityToken);

      // Create OAuth profile from Apple token
      const oauthProfile = {
        id: applePayload.sub,
        email: applePayload.email || user?.email || "",
        firstName: user?.name?.firstName,
        lastName: user?.name?.lastName,
        picture: undefined,
        provider: "apple" as const,
      };

      // Use OAuth service to find or create user
      const { OAuthService } = await import("./oauth.service");
      const oauthService = new OAuthService();
      const result = await oauthService.findOrCreateUser(oauthProfile);

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL;
      if (!frontendUrl && process.env.NODE_ENV === "production") {
        return res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      }
      const frontendUrlFinal =
        frontendUrl || process.env.FRONTEND_URL || "http://localhost:3000";
      const redirectUrl = new URL(`${frontendUrlFinal}/auth/callback`);
      redirectUrl.searchParams.set("accessToken", result.accessToken);
      redirectUrl.searchParams.set("refreshToken", result.refreshToken);
      redirectUrl.searchParams.set("success", "true");

      return res.redirect(redirectUrl.toString());
    } catch (error: any) {
      const frontendUrl = process.env.FRONTEND_URL;
      if (!frontendUrl && process.env.NODE_ENV === "production") {
        return res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      }
      const frontendUrlFinal =
        frontendUrl || process.env.FRONTEND_URL || "http://localhost:3000";
      const redirectUrl = new URL(`${frontendUrlFinal}/auth/callback`);
      redirectUrl.searchParams.set("success", "false");
      redirectUrl.searchParams.set(
        "error",
        error.message || "Apple Sign In failed"
      );

      return res.redirect(redirectUrl.toString());
    }
  })
);

export default router;
