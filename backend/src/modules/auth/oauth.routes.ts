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
  asyncHandler(async (req, res) => {
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
  asyncHandler(async (_req, res) => {
    // Handle Apple Sign In callback
    // Apple uses POST requests for callbacks
    const { identityToken } = _req.body;

    if (!identityToken) {
      return res.status(400).json({
        success: false,
        message: "Missing identity token",
      });
    }

    // TODO: Verify Apple identity token
    // This requires JWT verification with Apple's public keys
    // For now, return a placeholder response

    return res.status(501).json({
      success: false,
      message: "Apple Sign In callback requires additional implementation",
    });
  })
);

export default router;
