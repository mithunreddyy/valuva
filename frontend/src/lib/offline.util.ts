/**
 * Offline Detection and Handling Utility
 * Production-ready offline support with queue management
 */

import React from "react";

/**
 * Offline queue item interface
 */
export interface OfflineQueueItem {
  id: string;
  url: string;
  method: string;
  data?: unknown;
  headers?: Record<string, string>;
  timestamp: number;
}

class OfflineManager {
  private queue: OfflineQueueItem[] = [];
  private isOnline = true;
  private listeners: Array<(online: boolean) => void> = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.isOnline = navigator.onLine;
      this.loadQueue();

      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);
    }
  }

  /**
   * Check if device is online
   */
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Subscribe to online/offline status changes
   */
  onStatusChange(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Add request to offline queue
   */
  addToQueue(item: Omit<OfflineQueueItem, "id" | "timestamp">): string {
    const queueItem: OfflineQueueItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: Date.now(),
    };

    this.queue.push(queueItem);
    this.saveQueue();
    return queueItem.id;
  }

  /**
   * Get all queued items
   */
  getQueue(): OfflineQueueItem[] {
    return [...this.queue];
  }

  /**
   * Remove item from queue
   */
  removeFromQueue(id: string): void {
    this.queue = this.queue.filter((item) => item.id !== id);
    this.saveQueue();
  }

  /**
   * Process offline queue when back online
   */
  async processQueue(): Promise<void> {
    if (!this.isOnline || this.queue.length === 0) {
      return;
    }

    const items = [...this.queue];
    this.queue = [];

    for (const item of items) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: {
            "Content-Type": "application/json",
            ...item.headers,
          },
          body: item.data ? JSON.stringify(item.data) : undefined,
        });

        if (!response.ok) {
          // Re-queue failed requests
          this.queue.push(item);
        }
      } catch {
        // Re-queue failed requests
        this.queue.push(item);
      }
    }

    this.saveQueue();
  }

  private handleOnline = (): void => {
    this.isOnline = true;
    this.listeners.forEach((cb) => cb(true));
    this.processQueue();
  };

  private handleOffline = (): void => {
    this.isOnline = false;
    this.listeners.forEach((cb) => cb(false));
  };

  private saveQueue(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("offline_queue", JSON.stringify(this.queue));
      } catch {
        // Storage quota exceeded or disabled
        console.warn("Failed to save offline queue");
      }
    }
  }

  private loadQueue(): void {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("offline_queue");
        if (stored) {
          this.queue = JSON.parse(stored);
        }
      } catch {
        // Invalid stored data
        this.queue = [];
      }
    }
  }

  /**
   * Clear queue
   */
  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
  }
}

export const offlineManager = new OfflineManager();

/**
 * React hook for offline status
 * @returns true if offline, false if online
 */
export function useOfflineStatus(): boolean {
  const [isOnline, setIsOnline] = React.useState(
    offlineManager.getOnlineStatus()
  );

  React.useEffect(() => {
    const unsubscribe = offlineManager.onStatusChange(setIsOnline);
    return unsubscribe;
  }, []);

  return !isOnline; // Return offline status (inverse of online)
}
