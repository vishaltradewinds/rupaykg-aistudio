import { createClient } from "redis";

let redisClient: any = null;
let isConnected = false;
const inMemoryBlacklist = new Map<string, number>();

// Periodically evict expired tokens from in-memory store
setInterval(() => {
  const now = Date.now();
  for (const [key, exp] of inMemoryBlacklist.entries()) {
    if (exp <= now) {
      inMemoryBlacklist.delete(key);
    }
  }
}, 60000).unref?.();

const inMemoryStore = {
  get: async (key: string) => {
    const exp = inMemoryBlacklist.get(key);
    if (exp && exp > Date.now()) {
      return "true";
    }
    return null;
  },
  setEx: async (key: string, ttlSeconds: number, val: string) => {
    inMemoryBlacklist.set(key, Date.now() + ttlSeconds * 1000);
    return "OK";
  },
};

export async function getRedisClient() {
  if (!process.env.REDIS_URL) {
    return inMemoryStore;
  }

  if (!redisClient) {
    try {
      const url = process.env.REDIS_URL;
      redisClient = createClient({
        url,
        socket: {
          reconnectStrategy: (retries: number) => {
            if (retries > 3) {
              console.warn("[REDIS] Max connection attempts reached. Falling back to in-memory store.");
              return false;
            }
            return Math.min(retries * 500, 2000);
          },
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

      await redisClient.connect().catch((err: any) => {
        console.warn("[REDIS] Failed initial connection to Redis instance. In-memory fallback active.");
        isConnected = false;
      });
    } catch (e: any) {
      console.warn("[REDIS] Initialization error:", e?.message);
      return inMemoryStore;
    }
  }

  if (isConnected && redisClient) {
    return redisClient;
  }
  return inMemoryStore;
}

export function isRedisConnected() {
  return !process.env.REDIS_URL || isConnected;
}
