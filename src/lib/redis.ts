import { createClient } from "redis";

let redisClient: any = null;
let isConnected = false;

export async function getRedisClient() {
  if (!redisClient) {
    const url = process.env.REDIS_URL || "redis://localhost:6379";
    redisClient = createClient({ url });
    redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
    redisClient.on('connect', () => { isConnected = true; });
    await redisClient.connect().catch((err: any) => {
      console.warn("Could not connect to Redis, JWT revocation will fail closed.");
      isConnected = false;
    });
  }
  return redisClient;
}

export function isRedisConnected() {
  return isConnected;
}
