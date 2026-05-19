import pg from 'pg';
import { createClient } from 'redis';
import Database from 'better-sqlite3';

const { Pool } = pg;

export class InfraService {
  private static pgPool: pg.Pool | null = null;
  private static redisClient: any = null;
  private static sqlite: any = null;

  static async init() {
    // 1. PostgreSQL Integration
    if (process.env.DATABASE_URL) {
      this.pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      console.log("[INFRA] PostgreSQL Pool Initialized");
    } else {
      console.log("[INFRA] No DATABASE_URL. Using SQLite fallback for sovereign storage.");
      this.sqlite = new Database('sovereign.db');
      this.initSqliteSchema();
    }

    // 2. Redis integration
    if (process.env.REDIS_URL) {
      this.redisClient = createClient({ url: process.env.REDIS_URL });
      this.redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
      await this.redisClient.connect();
      console.log("[INFRA] Redis Connected");
    } else {
      console.log("[INFRA] No REDIS_URL. Caching in-memory.");
    }
  }

  private static initSqliteSchema() {
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS approvals (
        id TEXT PRIMARY KEY,
        waste_event_id TEXT,
        user_id TEXT,
        role TEXT,
        status TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS payouts (
        id TEXT PRIMARY KEY,
        waste_event_id TEXT,
        amount REAL,
        status TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  static async query(text: string, params?: any[]) {
    if (this.pgPool) {
      return await this.pgPool.query(text, params);
    } else if (this.sqlite) {
      // Basic translation for dummy queries
      const stmt = this.sqlite.prepare(text.replace(/\$\d+/g, '?'));
      return { rows: params ? stmt.all(...params) : stmt.all() };
    }
    return { rows: [] };
  }

  static async getCache(key: string) {
    if (this.redisClient) return await this.redisClient.get(key);
    return null;
  }

  static async setCache(key: string, value: string, expiry = 3600) {
    if (this.redisClient) {
      await this.redisClient.set(key, value, { EX: expiry });
    }
  }
}
