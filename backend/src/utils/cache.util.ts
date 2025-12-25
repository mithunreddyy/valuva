interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class CacheUtil {
  private static cache = new Map<string, CacheEntry<any>>();
  private static defaultTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data
   */
  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached data
   */
  static set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Delete cached data
   */
  static delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    this.cache.clear();
  }

  /**
   * Generate cache key from parameters
   */
  static generateKey(prefix: string, ...params: (string | number | Date)[]): string {
    const paramString = params
      .map((p) => (p instanceof Date ? p.toISOString() : String(p)))
      .join(":");
    return `${prefix}:${paramString}`;
  }

  /**
   * Clean expired entries (should be called periodically)
   */
  static cleanExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  static getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    this.cache.forEach((entry) => {
      if (now > entry.expiresAt) {
        expired++;
      } else {
        active++;
      }
    });

    return {
      total: this.cache.size,
      active,
      expired,
    };
  }
}

// Clean expired entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    CacheUtil.cleanExpired();
  }, 10 * 60 * 1000);
}

