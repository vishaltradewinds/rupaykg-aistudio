import { Pool } from 'pg';

/**
 * Read-only schema verification at startup.
 * The runtime application user (ai_studio_app_user) does NOT have DDL privileges.
 * Schema management and migrations are executed exclusively during deployment/migration phase.
 */
export async function ensureDatabaseSchema(pool: Pool): Promise<void> {
  const requiredTables = [
    'users',
    'records',
    'farmers',
    'carbon_events',
    'compliance_records',
    'system_notifications',
    'operational_logs',
    'pilot_onboardings',
    'pilot_records',
    'pilot_issues',
    'waste_manifests',
    'weighbridge_records',
    'cqe_methodologies',
    'hedera_anchors',
    'credit_custody',
    'credit_custody_events',
    'credit_market_listings',
    'credit_reservations',
    'credit_settlements',
  ];

  try {
    const result = await pool.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
      [requiredTables]
    );

    const existingTables = new Set(result.rows.map((r: any) => r.table_name));
    const missingTables = requiredTables.filter(t => !existingTables.has(t));

    if (missingTables.length > 0) {
      throw new Error(
        `Database schema is incomplete. Missing required tables: ${missingTables.join(', ')}. Run the deployment migrations before serving traffic.`
      );
    }

    const userColumns = await pool.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'users'
         AND column_name = ANY($1::text[])`,
      [['uid', 'email', 'password_hash', 'role']]
    );
    const requiredUserColumns = new Set(userColumns.rows.map((r: any) => r.column_name));
    const missingUserColumns = ['uid', 'email', 'password_hash', 'role'].filter(c => !requiredUserColumns.has(c));

    if (missingUserColumns.length > 0) {
      throw new Error(
        `Database schema is incompatible with authentication. Missing users columns: ${missingUserColumns.join(', ')}.`
      );
    }

    console.log(`[DB Schema Ready] All ${requiredTables.length} core database tables and authentication columns verified.`);
  } catch (err: any) {
    console.warn('[DB Schema Verification Failed]', err.message);
    throw err;
  }
}
