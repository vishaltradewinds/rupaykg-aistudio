import { Pool } from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('RUNTIME DB GUARD BLOCKED: DATABASE_URL is not set.');
}

const pool = new Pool({ connectionString: url, ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } });

try {
  const result = await pool.query(`
    SELECT current_user,
           session_user,
           r.rolsuper,
           r.rolbypassrls,
           r.rolcreaterole,
           r.rolcreatedb,
           r.rolreplication
    FROM pg_roles r
    WHERE r.rolname = current_user
  `);

  const row = result.rows[0];
  if (!row) throw new Error('RUNTIME DB GUARD BLOCKED: current database role could not be resolved.');

  const forbidden = [
    ['rolsuper', row.rolsuper],
    ['rolbypassrls', row.rolbypassrls],
    ['rolcreaterole', row.rolcreaterole],
    ['rolcreatedb', row.rolcreatedb],
    ['rolreplication', row.rolreplication],
  ].filter(([, value]) => value === true).map(([name]) => name);

  if (forbidden.length) {
    throw new Error(`RUNTIME DB GUARD BLOCKED: role ${row.current_user} has forbidden attributes: ${forbidden.join(', ')}.`);
  }

  console.log(`RUNTIME DB GUARD PASS: ${row.current_user} is non-superuser, NOBYPASSRLS, and non-administrative.`);
} finally {
  await pool.end();
}
