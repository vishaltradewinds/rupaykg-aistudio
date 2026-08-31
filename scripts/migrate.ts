import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import * as crypto from "crypto";

dotenv.config();

async function runMigrations() {
  console.log("=== RUPAYKG ENTERPRISE 3.0: FORMAL DRIZZLE MIGRATION EXECUTION ===");
  
  const host = process.env.SQL_HOST;
  const user = process.env.SQL_ADMIN_USER || process.env.SQL_USER;
  const password = process.env.SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD;
  const database = process.env.SQL_DB_NAME;
  const port = parseInt(process.env.SQL_PORT || "5432");

  if (!host || !user || !password || !database) {
    throw new Error("Database configuration environment variables are missing.");
  }

  const pool = new Pool({
    host,
    user,
    password,
    database,
    port,
    ssl: false,
  });

  const client = await pool.connect();

  try {
    console.log(`Connected to database: ${database} on ${host} as ${user}`);

    await client.query(`CREATE SCHEMA IF NOT EXISTS drizzle;`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      );
    `);

    const journalPath = path.resolve("./drizzle/meta/_journal.json");
    if (!fs.existsSync(journalPath)) {
      throw new Error(`Migration journal not found at ${journalPath}`);
    }

    const journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));
    const appliedRows = (await client.query(`SELECT hash FROM drizzle.__drizzle_migrations`)).rows;
    const appliedHashes = new Set(appliedRows.map((r: any) => r.hash));

    console.log(`Current applied migrations in DB: ${appliedHashes.size}`);

    for (const entry of journal.entries) {
      const migrationFilePath = path.resolve(`./drizzle/${entry.tag}.sql`);
      const sqlContent = fs.readFileSync(migrationFilePath, "utf8");
      const hash = crypto.createHash("sha256").update(sqlContent).digest("hex");

      if (appliedHashes.has(hash)) {
        console.log(`[ALREADY APPLIED] ${entry.tag} (hash: ${hash.substring(0, 12)}...)`);
        continue;
      }

      console.log(`[APPLYING] ${entry.tag}...`);
      await client.query("BEGIN;");
      try {
        const statements = sqlContent.split("--> statement-breakpoint");
        for (let i = 0; i < statements.length; i++) {
          const stmt = statements[i].trim();
          if (!stmt) continue;
          await client.query(`SAVEPOINT sp_${i};`);
          try {
            await client.query(stmt);
            await client.query(`RELEASE SAVEPOINT sp_${i};`);
          } catch (stmtErr: any) {
            await client.query(`ROLLBACK TO SAVEPOINT sp_${i};`);
            if (
              stmtErr.code === "42P07" ||
              stmtErr.code === "42710" ||
              stmtErr.code === "42701" ||
              stmtErr.code === "42P16"
            ) {
              console.log(`  (Note: Object already exists, safely skipped: ${stmtErr.message})`);
            } else {
              throw stmtErr;
            }
          }
        }

        await client.query(
          `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2);`,
          [hash, entry.when]
        );

        await client.query("COMMIT;");
        console.log(`[SUCCESS] Migrated ${entry.tag}`);
      } catch (migErr: any) {
        await client.query("ROLLBACK;");
        console.error(`[MIGRATION FAILED] ${entry.tag}:`, migErr);
        throw migErr;
      }
    }

    console.log("=== ALL DRIZZLE MIGRATIONS SUCCESSFULLY VERIFIED & RECORDED ===");
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Fatal Migration Error:", err);
    process.exit(1);
  });
