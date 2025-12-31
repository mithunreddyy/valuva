/**
 * Feature Flags Utility
 * Production-ready feature flag system for gradual rollouts and A/B testing
 * Supports percentage-based rollouts, user-based targeting, and environment-specific flags
 */

import { logger } from "./logger.util";

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage?: number;
  targetUsers?: string[];
  targetEnvironments?: string[];
  metadata?: Record<string, unknown>;
}

class FeatureFlagsUtil {
  private flags: Map<string, FeatureFlag> = new Map();
  private initialized = false;

  /**
   * Initialize feature flags from database or environment
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load from environment variables (for quick configuration)
      const envFlags = this.loadFlagsFromEnv();
      for (const flag of envFlags) {
        this.flags.set(flag.key, flag);
      }

      // In production, you might load from database
      // await this.loadFlagsFromDatabase();

      this.initialized = true;
      logger.info("Feature flags initialized", {
        count: this.flags.size,
      });
    } catch (error) {
      logger.error("Failed to initialize feature flags", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(
    key: string,
    userId?: string,
    environment?: string
  ): boolean {
    const flag = this.flags.get(key);

    if (!flag) {
      // Default to disabled if flag doesn't exist
      return false;
    }

    // Check if globally disabled
    if (!flag.enabled) {
      return false;
    }

    // Check environment targeting
    if (flag.targetEnvironments && environment) {
      if (!flag.targetEnvironments.includes(environment)) {
        return false;
      }
    }

    // Check user targeting
    if (flag.targetUsers && userId) {
      return flag.targetUsers.includes(userId);
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined) {
      if (userId) {
        // Consistent rollout based on user ID hash
        const hash = this.hashString(userId || "");
        const percentage = (hash % 100) + 1;
        return percentage <= flag.rolloutPercentage;
      } else {
        // Random rollout for anonymous users
        return Math.random() * 100 <= flag.rolloutPercentage;
      }
    }

    return true;
  }

  /**
   * Get feature flag value
   */
  getFlag(key: string): FeatureFlag | null {
    return this.flags.get(key) || null;
  }

  /**
   * Set feature flag (for admin operations)
   */
  setFlag(flag: FeatureFlag): void {
    this.flags.set(flag.key, flag);
    logger.info("Feature flag updated", { key: flag.key, enabled: flag.enabled });
  }

  /**
   * Get all feature flags
   */
  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  /**
   * Load flags from environment variables
   * Format: FEATURE_FLAG_<KEY>=enabled|disabled|percentage
   * Example: FEATURE_FLAG_NEW_CHECKOUT=enabled
   * Example: FEATURE_FLAG_AB_TEST=50 (50% rollout)
   */
  private loadFlagsFromEnv(): FeatureFlag[] {
    const flags: FeatureFlag[] = [];
    const prefix = "FEATURE_FLAG_";

    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith(prefix)) {
        const flagKey = key.replace(prefix, "").toLowerCase().replace(/_/g, "-");
        const flag: FeatureFlag = {
          key: flagKey,
          enabled: true,
        };

        if (value === "enabled" || value === "true") {
          flag.enabled = true;
        } else if (value === "disabled" || value === "false") {
          flag.enabled = false;
        } else {
          // Percentage rollout
          const percentage = value ? parseInt(value, 10) : NaN;
          if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
            flag.enabled = true;
            flag.rolloutPercentage = percentage;
          }
        }

        flags.push(flag);
      }
    }

    return flags;
  }

  /**
   * Hash string to number (for consistent user-based rollouts)
   */
  private hashString(str: string | undefined): number {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

export const featureFlags = new FeatureFlagsUtil();

