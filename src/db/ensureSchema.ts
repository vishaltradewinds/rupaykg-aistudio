import { Pool } from 'pg';

/**
 * Read-only schema verification at startup.
 * The runtime application user (ai_studio_app_user) does NOT have DDL privileges.
 * Schema management and migrations are executed exclusively during deployment/migration phase.
 */
export async function ensureDatabaseSchema(pool: Pool): Promise<void> {
  try {
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

    const result = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
      [requiredTables]
    );

    const existingTables = new Set(result.rows.map((r: any) => r.table_name));
    const missingTables = requiredTables.filter(t => !existingTables.has(t));

    if (missingTables.length > 0) {
      console.warn(`[DB Schema Warning] The following tables were not found in public schema: ${missingTables.join(', ')}. Please run migrations.`);
    } else {
      console.log(`[DB Schema Ready] All ${requiredTables.length} core database tables verified in public schema.`);
    }
  } catch (err: any) {
    console.warn('[DB Schema Verification Note]', err.message);
  }
}
