import { createClient } from "redis";

let redisClient: any = null;
let isConnected = false;
const inMemoryBlacklist = new Map<string, number>();

function isProductionEnvironment() {
  return process.env.NODE_ENV === 'production' || process.env.APP_MODE === 'production';
}

// Development/test-only fallback. Production must use durable Redis for token revocation.
setInterval(() => {
  const now = Date.now();
  for (const [key, exp] of inMemoryBlacklist.entries()) {
    if (exp <= now) inMemoryBlacklist.delete(key);
  }
}, 60000).unref?.();

const inMemoryStore = {
  get: async (key: string) => {
    const exp = inMemoryBlacklist.get(key);
    return exp && exp > Date.now() ? "true" : null;
  },
  setEx: async (key: string, ttlSeconds: number, val: string) => {
    inMemoryBlacklist.set(key, Date.now() + ttlSeconds * 1000);
    return "OK";
  },
};

export async function getRedisClient() {
  if (!process.env.REDIS_URL) {
    if (isProductionEnvironment()) {
      throw new Error('Production Redis is not configured. Set REDIS_URL; in-memory token revocation is prohibited in production.');
    }
    return inMemoryStore;
  }

  if (!redisClient) {
    const url = process.env.REDIS_URL;
    redisClient = createClient({
      url,
      socket: {
        reconnectStrategy: (retries: number) => retries > 3 ? false : Math.min(retries * 500, 2000),
      },
    });

    redisClient.on("error", (err: any) => {
      console.warn("[REDIS NOTICE]", err?.message || err);
      isConnected = false;
    });

    redisClient.on("connect", () => {
      isConnected = true;
      console.log("[REDIS] Connected to Redis instance successfully.");
    });

    try {
      await redisClient.connect();
    } catch (err: any) {
      isConnected = false;
      redisClient = null;
      if (isProductionEnvironment()) {
        throw new Error(`Production Redis connection failed: ${err?.message || 'unknown error'}`);
      }
      console.warn("[REDIS] Failed initial connection in non-production environment. In-memory fallback active.");
      return inMemoryStore;
    }
  }

  if (isConnected && redisClient) return redisClient;
  if (isProductionEnvironment()) throw new Error('Production Redis is unavailable; refusing in-memory token revocation fallback.');
  return inMemoryStore;
}

export function isRedisConnected() {
  if (isProductionEnvironment()) return Boolean(process.env.REDIS_URL && isConnected);
  return !process.env.REDIS_URL || isConnected;
}
