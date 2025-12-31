import { logger } from "./logger.util";

/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by stopping requests to failing services
 * 
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Service is failing, requests are blocked
 * - HALF_OPEN: Testing if service has recovered
 */
export enum CircuitState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN",
}

export interface CircuitBreakerOptions {
  failureThreshold: number; // Number of failures before opening
  resetTimeout: number; // Time in ms before attempting to close
  monitoringWindow: number; // Time window for failure counting
  halfOpenMaxCalls: number; // Max calls in half-open state
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number[] = [];
  private lastFailureTime: number = 0;
  private halfOpenCalls: number = 0;
  private options: CircuitBreakerOptions;

  constructor(
    private name: string,
    options: Partial<CircuitBreakerOptions> = {}
  ) {
    this.options = {
      failureThreshold: options.failureThreshold || 5,
      resetTimeout: options.resetTimeout || 60000, // 1 minute
      monitoringWindow: options.monitoringWindow || 60000, // 1 minute
      halfOpenMaxCalls: options.halfOpenMaxCalls || 3,
    };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(
    fn: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    // Check if circuit is open
    if (this.state === CircuitState.OPEN) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure >= this.options.resetTimeout) {
        // Transition to half-open
        this.state = CircuitState.HALF_OPEN;
        this.halfOpenCalls = 0;
        logger.info("Circuit breaker transitioning to HALF_OPEN", {
          name: this.name,
        });
      } else {
        // Circuit is still open, use fallback or throw
        if (fallback) {
          logger.warn("Circuit breaker is OPEN, using fallback", {
            name: this.name,
          });
          return fallback();
        }
        throw new Error(`Circuit breaker is OPEN for ${this.name}`);
      }
    }

    // Check half-open state limit
    if (this.state === CircuitState.HALF_OPEN) {
      if (this.halfOpenCalls >= this.options.halfOpenMaxCalls) {
        // Too many calls in half-open, open the circuit
        this.state = CircuitState.OPEN;
        this.lastFailureTime = Date.now();
        logger.warn("Circuit breaker opened from HALF_OPEN", {
          name: this.name,
        });
        if (fallback) {
          return fallback();
        }
        throw new Error(`Circuit breaker is OPEN for ${this.name}`);
      }
      this.halfOpenCalls++;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback) {
        logger.warn("Operation failed, using fallback", {
          name: this.name,
          error: error instanceof Error ? error.message : String(error),
        });
        return fallback();
      }
      throw error;
    }
  }

  private onSuccess(): void {
    // Clean old failures
    const now = Date.now();
    this.failures = this.failures.filter(
      (time) => now - time < this.options.monitoringWindow
    );

    // If in half-open and successful, close the circuit
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.CLOSED;
      this.halfOpenCalls = 0;
      logger.info("Circuit breaker closed after successful recovery", {
        name: this.name,
      });
    }
  }

  private onFailure(): void {
    const now = Date.now();
    this.failures.push(now);

    // Clean old failures
    this.failures = this.failures.filter(
      (time) => now - time < this.options.monitoringWindow
    );

    this.lastFailureTime = now;

    // Check if we should open the circuit
    if (
      this.failures.length >= this.options.failureThreshold &&
      this.state !== CircuitState.OPEN
    ) {
      this.state = CircuitState.OPEN;
      logger.error("Circuit breaker opened due to failures", {
        name: this.name,
        failures: this.failures.length,
        threshold: this.options.failureThreshold,
      });
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = [];
    this.halfOpenCalls = 0;
    this.lastFailureTime = 0;
    logger.info("Circuit breaker manually reset", { name: this.name });
  }
}

// Global circuit breakers for external services
export const circuitBreakers = {
  email: new CircuitBreaker("email", {
    failureThreshold: 3,
    resetTimeout: 30000,
  }),
  storage: new CircuitBreaker("storage", {
    failureThreshold: 5,
    resetTimeout: 60000,
  }),
  shipping: new CircuitBreaker("shipping", {
    failureThreshold: 3,
    resetTimeout: 60000,
  }),
};

