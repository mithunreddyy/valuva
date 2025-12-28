import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { env } from "./env";

/**
 * Initialize Sentry for error tracking and performance monitoring
 * Only initializes in production or if SENTRY_DSN is provided
 */
export const initSentry = (): void => {
  if (!env.SENTRY_DSN) {
    return; // Sentry is optional
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT || env.NODE_ENV,
    tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
    profilesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
    integrations: [nodeProfilingIntegration()],
    // Session tracking
    autoSessionTracking: true,
    // Don't send errors in development
    enabled: env.NODE_ENV === "production" || !!env.SENTRY_DSN,
  });
};

/**
 * Capture exception to Sentry
 */
export const captureException = (
  error: Error,
  context?: Record<string, any>
): void => {
  if (env.SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};

/**
 * Capture message to Sentry
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: Record<string, any>
): void => {
  if (env.SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    });
  }
};
