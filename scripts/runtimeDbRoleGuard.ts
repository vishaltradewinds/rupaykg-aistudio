import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DB_SSL === "true"
        ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false" }
        : undefined,
  });

  try {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT current_user AS role_name,
               rolsuper,
               rolcreaterole,
               rolcreatedb,
               rolreplication,
               rolbypassrls
        FROM pg_roles
        WHERE rolname = current_user
      `);
      const r = rows[0];
      if (!r) throw new Error("RUNTIME ROLE GUARD BLOCKED: current PostgreSQL role could not be resolved.");

      console.log("=== RUPAYKG RUNTIME DB ROLE GUARD ===");
      console.log(`role: ${r.role_name}`);
      console.log(`superuser: ${r.rolsuper}`);
      console.log(`create role: ${r.rolcreaterole}`);
      console.log(`create database: ${r.rolcreatedb}`);
      console.log(`replication: ${r.rolreplication}`);
      console.log(`bypass RLS: ${r.rolbypassrls}`);

      if (r.rolsuper || r.rolcreaterole || r.rolcreatedb || r.rolreplication || r.rolbypassrls) {
        throw new Error(
          "RUNTIME ROLE GUARD BLOCKED: deployed runtime identity has administrative or RLS-bypass capability."
        );
      }

      console.log("RUNTIME DB ROLE GUARD: PASS");
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
