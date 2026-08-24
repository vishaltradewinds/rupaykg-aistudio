import { Pool } from 'pg';

export async function ensureDatabaseSchema(pool: Pool) {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      uid text UNIQUE NOT NULL,
      email text UNIQUE NOT NULL,
      phone text UNIQUE,
      role text NOT NULL,
      name text NOT NULL,
      state text,
      district text,
      subdistrict text,
      local_area text,
      village text,
      organization_name text,
      wallet_balance double precision DEFAULT 0,
      created_at timestamp DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS records (
      id text PRIMARY KEY,
      user_id text NOT NULL,
      waste_type text NOT NULL,
      weight_kg double precision NOT NULL,
      village text,
      status text NOT NULL DEFAULT 'pending',
      mrv_status text NOT NULL DEFAULT 'pending',
      mrv_verified_by text,
      total_value double precision DEFAULT 0,
      ccc_amount_kg double precision DEFAULT 0,
      potential_ccc_value double precision DEFAULT 0,
      risk_score double precision,
      evidence_urls jsonb,
      timestamp timestamp DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS farmers (
      id text PRIMARY KEY,
      name text NOT NULL,
      phone text,
      aadhaar_hash text,
      village text,
      subdistrict text,
      district text,
      state text,
      land_area_acres double precision DEFAULT 0,
      primary_crop text,
      bank_account text,
      ifsc text,
      shg_id text,
      fpo_id text,
      created_by text,
      metadata jsonb,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS carbon_events (
      id text PRIMARY KEY,
      record_id text,
      event_type text NOT NULL DEFAULT 'GENERATION',
      amount_tco2e double precision DEFAULT 0,
      status text NOT NULL DEFAULT 'RECORDED',
      stakeholder_chain jsonb,
      methodology_code text,
      evidence_hash text,
      village text,
      district text,
      state text,
      metadata jsonb,
      created_at timestamp DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS compliance_records (
      id text PRIMARY KEY,
      entity_id text,
      compliance_type text NOT NULL DEFAULT 'EPR_PLASTIC',
      reporting_period text,
      status text NOT NULL DEFAULT 'COMPLIANT',
      target_quantity double precision DEFAULT 0,
      achieved_quantity double precision DEFAULT 0,
      evidence_urls jsonb,
      verified_by text,
      metadata jsonb,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS system_notifications (
      id text PRIMARY KEY,
      user_id text NOT NULL,
      title text NOT NULL,
      message text NOT NULL,
      type text NOT NULL DEFAULT 'INFO',
      read boolean DEFAULT false,
      created_at timestamp DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS operational_logs (
      id text PRIMARY KEY,
      level text NOT NULL DEFAULT 'INFO',
      category text NOT NULL,
      message text NOT NULL,
      user_id text,
      metadata jsonb,
      timestamp timestamp DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS blockchain_blocks (
      id text PRIMARY KEY,
      block_index integer NOT NULL,
      previous_hash text NOT NULL,
      hash text NOT NULL,
      data jsonb NOT NULL,
      timestamp timestamp DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS pilot_onboardings (
      id text PRIMARY KEY,
      pilot_name text NOT NULL,
      pilot_type text NOT NULL DEFAULT 'URBAN_ULB',
      location jsonb,
      operator_entity_id text,
      status text NOT NULL DEFAULT 'ACTIVE',
      onboarding_date timestamp DEFAULT now(),
      baseline_data jsonb,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS pilot_records (
      id text PRIMARY KEY,
      pilot_id text NOT NULL,
      facility_id text,
      material_type text NOT NULL DEFAULT 'ORGANIC',
      weight_kg double precision NOT NULL DEFAULT 0,
      weighbridge_ticket text,
      gps_coordinates jsonb,
      status text NOT NULL DEFAULT 'RECORDED',
      metadata jsonb,
      created_at timestamp DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS pilot_issues (
      id text PRIMARY KEY,
      pilot_id text NOT NULL,
      issue_type text NOT NULL,
      severity text NOT NULL DEFAULT 'MEDIUM',
      description text NOT NULL,
      status text NOT NULL DEFAULT 'OPEN',
      resolved_at timestamp,
      created_at timestamp DEFAULT now()
    );`,
  ];

  for (const q of queries) {
    try {
      await pool.query(q);
    } catch (err: any) {
      console.warn('Auto-schema creation notice:', err.message);
    }
  }
}
