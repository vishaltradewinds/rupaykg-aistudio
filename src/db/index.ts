import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';
import fs from 'fs';
import * as schema from './schema.ts';
import { ensureDatabaseSchema } from './ensureSchema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

function isProductionEnvironment() {
  return process.env.NODE_ENV === 'production' || process.env.APP_MODE === 'production';
}

export function isTransientDbError(err: any): boolean {
  const code = err?.code || err?.cause?.code;
  const message = String(err?.message || '') + ' ' + String(err?.cause?.message || '');
  return (
    code === 'ENOENT' ||
    code === 'ECONNREFUSED' ||
    code === 'ECONNRESET' ||
    code === 'ETIMEDOUT' ||
    code === 'EPIPE' ||
    code === '57P01' ||
    code === '57P03' ||
    message.includes('Connection terminated unexpectedly') ||
    message.includes('Client has encountered a connection error') ||
    message.includes('.s.PGSQL.')
  );
}

export async function withDbRetry<T>(operation: () => Promise<T>, maxAttempts = 4): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      if (!isTransientDbError(err) || attempt === maxAttempts) {
        throw err;
      }
      const delayMs = 150 * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

export const createPool = () => {
  if (!global._postgresPool) {
    let config: PoolConfig = {
      max: 20,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 15000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    };

    // Prefer a complete DATABASE_URL. Otherwise require an explicit SQL configuration.
    if (process.env.DATABASE_URL) {
      config.connectionString = process.env.DATABASE_URL;
    } else {
      const host = process.env.SQL_HOST;
      const user = process.env.SQL_USER;
      const password = process.env.SQL_PASSWORD;
      const database = process.env.SQL_DB_NAME;

      if (isProductionEnvironment() && (!host || !user || !password || !database)) {
        throw new Error(
          'Production PostgreSQL is not configured. Set DATABASE_URL or SQL_HOST, SQL_USER, SQL_PASSWORD, and SQL_DB_NAME before starting RupayKg.'
        );
      }

      config.host = host || 'localhost';
      config.user = user || 'postgres';
      config.password = password || '';
      config.database = database || 'rupaykg';

      if (process.env.SQL_PORT) {
        const portNum = parseInt(process.env.SQL_PORT, 10);
        if (!isNaN(portNum)) config.port = portNum;
      }
    }

    // Production must verify the database server certificate unless explicitly configured otherwise.
    const isSslEnabled = process.env.DB_SSL === 'true' || (isProductionEnvironment() && process.env.DB_SSL !== 'false');

    if (isSslEnabled) {
      if (process.env.DB_CA_CERT) {
        let caContent = process.env.DB_CA_CERT;
        try {
          if (fs.existsSync(caContent)) caContent = fs.readFileSync(caContent, 'utf8');
        } catch {
          // If not a valid file path, use as raw PEM certificate string.
        }
        config.ssl = { ca: caContent, rejectUnauthorized: true };
      } else if (process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false') {
        config.ssl = { rejectUnauthorized: false };
      } else {
        config.ssl = { rejectUnauthorized: true };
      }
    }

    global._postgresPool = new Pool(config);

    global._postgresPool.on('error', (err) => {
      console.warn('SQL pool idle client notice (pool will reconnect automatically):', err?.message || err);
    });

    // Runtime performs read-only schema verification with transient socket retry.
    withDbRetry(() => ensureDatabaseSchema(global._postgresPool!), 5).catch(err => {
      console.warn('Non-blocking schema verification note:', err.message);
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });
