import { Pool } from 'pg';

/**
 * Read-only schema verification at startup.
 * The runtime application user does NOT have DDL privileges.
 * Schema management and migrations are executed exclusively during deployment/migration phase.
 */
export async function ensureDatabaseSchema(pool: Pool): Promise<void> {
  try {
    const requiredTables = [
      'users', 'records', 'farmers', 'carbon_events', 'compliance_records',
      'system_notifications', 'operational_logs', 'pilot_onboardings', 'pilot_records',
      'pilot_issues', 'waste_manifests', 'weighbridge_records', 'cqe_methodologies',
      'hedera_anchors', 'environmental_credit_positions', 'environmental_credit_transactions',
      'gcp_commercial_lifecycle_events'
    ];

    const result = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
      [requiredTables]
    );

    const existingTables = new Set(result.rows.map((r: any) => r.table_name));
    const missingTables = requiredTables.filter(t => !existingTables.has(t));

    if (missingTables.length > 0) {
      console.warn(`[DB Schema Warning] Missing tables: ${missingTables.join(', ')}. Run deployment migrations.`);
    } else {
      console.log(`[DB Schema Ready] All ${requiredTables.length} required tables verified.`);
    }
  } catch (err: any) {
    console.warn('[DB Schema Verification Note]', err.message);
  }
}
