import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { env } from "../../config/env";
import { logger } from "../../utils/logger.util";

/**
 * Apple OAuth Utility
 * Handles Apple identity token verification
 * Production-ready implementation
 */

const APPLE_ISSUER = "https://appleid.apple.com";
const APPLE_AUDIENCE = env.APPLE_CLIENT_ID;

// Create JWKS client for fetching Apple's public keys
const client = jwksClient({
  jwksUri: "https://appleid.apple.com/auth/keys",
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

/**
 * Get signing key for JWT verification
 */
function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

/**
 * Verify Apple identity token
 * Production-ready JWT verification with Apple's public keys
 */
export async function verifyAppleIdentityToken(
  identityToken: string
): Promise<{
  sub: string; // Apple user ID
  email?: string;
  email_verified?: boolean;
}> {
  if (!APPLE_AUDIENCE) {
    throw new Error("APPLE_CLIENT_ID is not configured");
  }

  return new Promise((resolve, reject) => {
    jwt.verify(
      identityToken,
      getKey,
      {
        audience: APPLE_AUDIENCE,
        issuer: APPLE_ISSUER,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          logger.error("Apple identity token verification failed", {
            error: err.message,
          });
          return reject(new Error("Invalid Apple identity token"));
        }

        const payload = decoded as {
          sub: string;
          email?: string;
          email_verified?: boolean;
        };

        resolve(payload);
      }
    );
  });
}

