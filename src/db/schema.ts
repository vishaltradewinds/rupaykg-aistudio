import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, doublePrecision, boolean, jsonb } from 'drizzle-orm/pg-core';

// Users table (representing citizens, officials, etc.)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID representing SSO
  email: text('email').notNull(),
  role: text('role').notNull().default('citizen'),
  name: text('name').notNull(),
  state: text('state'),
  district: text('district'),
  village: text('village'),
  wallet_balance: doublePrecision('wallet_balance').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Mock records migrated to Postgres
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
