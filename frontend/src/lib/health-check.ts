/**
 * Health Check Utility
 * Monitors backend health status
 * Production-ready health monitoring
 */

import React from "react";

export interface HealthStatus {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  checks: {
    database: string;
    redis: string;
    memory: {
      status: string;
      rss: number;
      heapUsed: number;
    };
  };
}

class HealthCheck {
  private apiUrl: string;
  private checkInterval: NodeJS.Timeout | null = null;
  private lastStatus: HealthStatus | null = null;
  private listeners: Array<(status: HealthStatus) => void> = [];

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  }

  /**
   * Check backend health
   */
  async checkHealth(): Promise<HealthStatus | null> {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Don't cache health checks
        cache: "no-store",
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      this.lastStatus = data;
      
      // Notify listeners
      this.listeners.forEach((listener) => listener(data));
      
      return data;
    } catch (error) {
      console.error("Health check failed", error);
      return null;
    }
  }

  /**
   * Start periodic health checks
   */
  startMonitoring(intervalMs: number = 60000): void {
    if (this.checkInterval) {
      this.stopMonitoring();
    }

    // Check immediately
    this.checkHealth();

    // Then check periodically
    this.checkInterval = setInterval(() => {
      this.checkHealth();
    }, intervalMs);
  }

  /**
   * Stop health check monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Get last known health status
   */
  getLastStatus(): HealthStatus | null {
    return this.lastStatus;
  }

  /**
   * Subscribe to health status updates
   */
  onStatusChange(listener: (status: HealthStatus) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Check if backend is healthy
   */
  isHealthy(): boolean {
    return this.lastStatus?.status === "healthy";
  }
}

// Singleton instance
export const healthCheck = new HealthCheck();

// React hook for health status
export function useHealthCheck() {
  const [status, setStatus] = React.useState<HealthStatus | null>(
    healthCheck.getLastStatus()
  );
  const [isHealthy, setIsHealthy] = React.useState<boolean>(
    healthCheck.isHealthy()
  );

  React.useEffect(() => {
    // Initial check
    healthCheck.checkHealth().then((healthStatus) => {
      setStatus(healthStatus);
      setIsHealthy(healthStatus?.status === "healthy" || false);
    });

    // Subscribe to updates
    const unsubscribe = healthCheck.onStatusChange((newStatus) => {
      setStatus(newStatus);
      setIsHealthy(newStatus.status === "healthy");
    });

    // Start monitoring
    healthCheck.startMonitoring(60000); // Check every minute

    return () => {
      unsubscribe();
      healthCheck.stopMonitoring();
    };
  }, []);

  return { status, isHealthy };
}

