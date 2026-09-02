import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, doublePrecision, boolean, jsonb, uuid, varchar, numeric } from 'drizzle-orm/pg-core';

// Users table (representing citizens, officials, etc.)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID representing SSO
  loginId: text('login_id').unique(), // Explicit application login identifier; never a frontend-only field
  email: text('email').notNull(),
  passwordHash: text('password_hash'),
  role: text('role'), // Stakeholder role assigned upon explicit registration
  name: text('name').notNull(),
  phone: text('phone'),
  state: text('state'),
  district: text('district'),
  subdistrict: text('subdistrict'),
  local_area: text('local_area'),
  village: text('village'),
  organization_name: text('organization_name'),
  wallet_balance: doublePrecision('wallet_balance').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const password_reset_tokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  identifier: text('identifier').notNull(),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('used').default(false),
  attempts: integer('attempts').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});


export const records = pgTable('records', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  wasteType: text('waste_type').notNull(),
  weightKg: doublePrecision('weight_kg').notNull(),
  village: text('village'),
  status: text('status').notNull().default('pending'),
  mrvStatus: text('mrv_status').notNull().default('pending'),
  mrvVerifiedBy: text('mrv_verified_by'),
  totalValue: doublePrecision('total_value').default(0),
  cccAmountKg: doublePrecision('ccc_amount_kg').default(0),
  potentialCccValue: doublePrecision('potential_ccc_value').default(0),
  riskScore: doublePrecision('risk_score'),
  evidenceUrls: jsonb('evidence_urls'), // Example of storing metadata
  timestamp: timestamp('timestamp').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  records: many(records),
}));

export const recordsRelations = relations(records, ({ one }) => ({
  author: one(users, {
    fields: [records.userId],
    references: [users.uid],
  }),
}));

// ==========================================
// RUPAYKG CARBON OS V1.1 - SCHEMA
// ==========================================

export const carbon_programmes = pgTable('carbon_programmes', {
  id: text('id').primaryKey(),
  icmAccountId: text('icm_account_id').references(() => icm_accounts.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  programmeType: text('programme_type').notNull().default('PoA'),
  status: text('status').notNull().default('DRAFT'),
  geographicalScope: text('geographical_scope'),
  technologyScope: text('technology_scope'),
  methodologyScope: text('methodology_scope'),
  baselineApproach: text('baseline_approach'),
  additionalityApproach: text('additionality_approach'),
  startDate: timestamp('start_date'),
  creditingPeriod: integer('crediting_period_years'),