/**
 * Logger Utility
 * Provides structured logging with different log levels
 * Production-ready logging with context support
 */

export enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

/**
 * Log context interface for structured logging
 */
interface LogContext {
  [key: string]: unknown;
}

/**
 * Logger class for structured logging
 */
class Logger {
  /**
   * Format log message with timestamp and context
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }

  /**
   * Internal log method that routes to appropriate console method
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(level, message, context);
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        if (process.env.NODE_ENV === "development") {
          console.debug(formattedMessage);
        }
        break;
    }
  }

  /**
   * Log error message
   * @param message - Error message
   * @param context - Optional context object
   */
  error(message: string, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Log warning message
   * @param message - Warning message
   * @param context - Optional context object
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log info message
   * @param message - Info message
   * @param context - Optional context object
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log debug message (only in development)
   * @param message - Debug message
   * @param context - Optional context object
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }
}

export const logger = new Logger();

