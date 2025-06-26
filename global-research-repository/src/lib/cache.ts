import React from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private storage = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.storage.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.storage.get(key);
    
    if (!item) {
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;
    
    if (isExpired) {
      this.storage.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  // Cache with automatic key generation
  cacheKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }
}

// Global cache instance
export const cache = new Cache();

// Cache decorator for functions
export function cached<T extends (...args: any[]) => any>(
  ttl: number = 5 * 60 * 1000
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const cacheKey = `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;
      const cachedResult = cache.get(cacheKey);
      
      if (cachedResult !== null) {
        return cachedResult;
      }

      const result = originalMethod.apply(this, args);
      
      if (result instanceof Promise) {
        return result.then(data => {
          cache.set(cacheKey, data, ttl);
          return data;
        });
      } else {
        cache.set(cacheKey, result, ttl);
        return result;
      }
    };

    return descriptor;
  };
}

// React hook for caching
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = React.useCallback(async () => {
    // Check cache first
    const cachedData = cache.get<T>(key);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      cache.set(key, result, ttl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
} 