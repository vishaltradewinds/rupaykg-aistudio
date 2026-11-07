import { Pool, PoolConfig } from "pg";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

function buildPoolConfig(): PoolConfig {
  const config: PoolConfig = {};

  if (process.env.DATABASE_URL) {
    config.connectionString = process.env.DATABASE_URL;
  } else {
    const host = process.env.SQL_HOST;
    const user = process.env.SQL_ADMIN_USER || process.env.SQL_USER;
    const password = process.env.SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD;
    const database = process.env.SQL_DB_NAME;
    const port = parseInt(process.env.SQL_PORT || "5432", 10);

    if (!host || !user || !password || !database) {
      throw new Error(
        "Database configuration missing. Set DATABASE_URL or SQL_HOST, SQL_USER, SQL_PASSWORD, and SQL_DB_NAME."
      );
    }

    Object.assign(config, { host, user, password, database, port });
  }

  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.APP_MODE === "production";
  const sslEnabled =
    process.env.DB_SSL === "true" ||
    (isProduction && process.env.DB_SSL !== "false");

  if (sslEnabled) {
    if (process.env.DB_CA_CERT) {
      let caContent = process.env.DB_CA_CERT;
      try {
        if (fs.existsSync(caContent)) {
          caContent = fs.readFileSync(caContent, "utf8");
        }
      } catch {
        // Treat the value as inline PEM when it is not a file path.
      }
      config.ssl = { ca: caContent, rejectUnauthorized: true };
    } else {
      config.ssl = {
        rejectUnauthorized:
          process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
      };
    }
  }

  return config;
}

function journalEntryCount(): number {
  const journalPath = path.resolve("./drizzle/meta/_journal.json");
  if (!fs.existsSync(journalPath)) {
    throw new Error(`Migration journal not found at ${journalPath}`);
  }

  const journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));
  if (!Array.isArray(journal.entries)) {
    throw new Error("Migration journal is malformed: entries is not an array.");
  }

  return journal.entries.length;
}

async function main() {
  const pool = new Pool(buildPoolConfig());

  try {
    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT
          current_database() AS database_name,
          current_user AS current_user,
          to_regclass('public.schema_migrations') AS custom_ledger,
          to_regclass('drizzle.__drizzle_migrations') AS drizzle_ledger
      `);

      const row = result.rows[0];
      const customLedgerExists = Boolean(row.custom_ledger);
      const drizzleLedgerExists = Boolean(row.drizzle_ledger);
      const journalCount = journalEntryCount();

      console.log("=== RUPAYKG MIGRATION AUTHORITY GUARD ===");
      console.log(`database: ${row.database_name}`);
      console.log(`connected role: ${row.current_user}`);
      console.log(`repo Drizzle journal entries: ${journalCount}`);
      console.log(`public.schema_migrations: ${customLedgerExists ? "PRESENT" : "ABSENT"}`);
      console.log(
        `drizzle.__drizzle_migrations: ${drizzleLedgerExists ? "PRESENT" : "ABSENT"}`
      );

      if (customLedgerExists && !drizzleLedgerExists) {
        throw new Error(
          "MIGRATION AUTHORITY BLOCKED: production has public.schema_migrations but no drizzle.__drizzle_migrations. Reconcile authoritative migration history before running Drizzle migrations."
        );
      }

      if (
        customLedgerExists &&
        process.env.MIGRATION_AUTHORITY_RECONCILED !== "true"
      ) {
        throw new Error(
          "MIGRATION AUTHORITY BLOCKED: public.schema_migrations exists. MIGRATION_AUTHORITY_RECONCILED=true is required only after authoritative history reconciliation and CI parity evidence."
        );
      }

      if (!customLedgerExists && !drizzleLedgerExists) {
        throw new Error(
          "MIGRATION AUTHORITY BLOCKED: no recognized migration ledger exists in the target database."
        );
      }

      if (drizzleLedgerExists && journalCount === 0) {
        throw new Error(
          "MIGRATION AUTHORITY BLOCKED: repository Drizzle journal is empty while a Drizzle ledger exists."
        );
      }

      console.log("MIGRATION AUTHORITY GUARD: PASS");
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(String(error instanceof Error ? error.message : error));
  process.exit(1);
});
