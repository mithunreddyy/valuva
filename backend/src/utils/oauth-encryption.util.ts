import crypto from "crypto";
import { env } from "../config/env";

/**
 * OAuth Token Encryption Utility
 * Encrypts and decrypts OAuth access/refresh tokens before storing in database
 */
export class OAuthEncryption {
  private static readonly ALGORITHM = "aes-256-gcm";
  private static readonly IV_LENGTH = 16;
  private static readonly SALT_LENGTH = 64;
  private static readonly TAG_LENGTH = 16;
  private static readonly TAG_POSITION = this.SALT_LENGTH + this.IV_LENGTH;
  private static readonly ENCRYPTED_POSITION = this.TAG_POSITION + this.TAG_LENGTH;

  private static getKey(): Buffer {
    const encryptionKey = env.OAUTH_ENCRYPTION_KEY || env.JWT_SECRET;
    if (!encryptionKey || encryptionKey.length < 32) {
      throw new Error("OAUTH_ENCRYPTION_KEY must be at least 32 characters long");
    }
    return crypto.scryptSync(encryptionKey, "oauth-salt", 32);
  }

  /**
   * Encrypt OAuth token
   */
  static encrypt(text: string): string {
    try {
      const key = this.getKey();
      const iv = crypto.randomBytes(this.IV_LENGTH);
      const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");

      const tag = cipher.getAuthTag();

      // Combine salt, iv, tag, and encrypted data
      return (
        iv.toString("hex") +
        tag.toString("hex") +
        encrypted
      );
    } catch (error) {
      console.error("OAuth encryption error:", error);
      throw new Error("Failed to encrypt OAuth token");
    }
  }

  /**
   * Decrypt OAuth token
   */
  static decrypt(encryptedText: string): string {
    try {
      const key = this.getKey();
      const iv = Buffer.from(encryptedText.slice(0, this.IV_LENGTH * 2), "hex");
      const tag = Buffer.from(
        encryptedText.slice(this.IV_LENGTH * 2, this.ENCRYPTED_POSITION * 2),
        "hex"
      );
      const encrypted = encryptedText.slice(this.ENCRYPTED_POSITION * 2);

      const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      console.error("OAuth decryption error:", error);
      throw new Error("Failed to decrypt OAuth token");
    }
  }
}

