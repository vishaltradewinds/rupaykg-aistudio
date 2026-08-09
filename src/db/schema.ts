import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, doublePrecision, boolean, jsonb } from 'drizzle-orm/pg-core';

// Users table (representing citizens, officials, etc.)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID representing SSO
  email: text('email').notNull(),
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

export const carbon_projects = pgTable('carbon_projects', {
  id: text('id').primaryKey(), // e.g., UUID
  name: text('name').notNull(),
  description: text('description'),
  ownerId: text('owner_id').references(() => users.uid).notNull(),
  status: text('status').notNull().default('DRAFT'), // DRAFT, ELIGIBLE, REGISTERED, REJECTED
  methodologyId: text('methodology_id'),
  wasteSourceRecordId: text('waste_source_record_id').references(() => records.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const facilities = pgTable('facilities', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id).notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // LANDFILL, MRF, BIOGAS, etc.
  location: jsonb('location'), // GeoJSON or coordinates
  createdAt: timestamp('created_at').defaultNow(),
});

export const methodologies = pgTable('methodologies', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(), // e.g., 'BM WA03.001'
  name: text('name').notNull(),
  description: text('description'),
  activeVersion: text('active_version').notNull(),
});

export const methodology_versions = pgTable('methodology_versions', {
  id: text('id').primaryKey(),
  methodologyId: text('methodology_id').references(() => methodologies.id).notNull(),
  version: text('version').notNull(),
  publishedAt: timestamp('published_at').notNull(),
  sourceDocument: text('source_document'),
  sourceHash: text('source_hash'),
});

export const methodology_parameters = pgTable('methodology_parameters', {
  id: text('id').primaryKey(),
  methodologyVersionId: text('methodology_version_id').references(() => methodology_versions.id).notNull(),
  parameterName: text('parameter_name').notNull(),
  dataType: text('data_type').notNull(),
  unit: text('unit'),
  description: text('description'),
  isRequired: boolean('is_required').default(true),
});

export const monitoring_periods = pgTable('monitoring_periods', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: text('status').notNull().default('ACTIVE'), // ACTIVE, CLOSED, VERIFIED
});

export const instruments = pgTable('instruments', {
  id: text('id').primaryKey(),
  facilityId: text('facility_id').references(() => facilities.id).notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // FLOW_METER, THERMOMETER, etc.
  status: text('status').notNull().default('ACTIVE'),
});

export const calibrations = pgTable('calibrations', {
  id: text('id').primaryKey(),
  instrumentId: text('instrument_id').references(() => instruments.id).notNull(),
  calibrationDate: timestamp('calibration_date').notNull(),
  expiryDate: timestamp('expiry_date').notNull(),
  certificateUrl: text('certificate_url'),
  certificateHash: text('certificate_hash'),
});

export const measurements = pgTable('measurements', {
  id: text('id').primaryKey(),
  monitoringPeriodId: text('monitoring_period_id').references(() => monitoring_periods.id).notNull(),
  instrumentId: text('instrument_id').references(() => instruments.id),
  parameterId: text('parameter_id').references(() => methodology_parameters.id).notNull(),
  value: doublePrecision('value').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  recordedBy: text('recorded_by').references(() => users.uid),
});

export const evidence = pgTable('evidence', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id).notNull(),
  measurementId: text('measurement_id').references(() => measurements.id),
  uploaderId: text('uploader_id').references(() => users.uid).notNull(),
  fileUrl: text('file_url').notNull(),
  fileHash: text('file_hash').notNull(),
  version: integer('version').default(1),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const calculation_datasets = pgTable('calculation_datasets', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id).notNull(),
  monitoringPeriodId: text('monitoring_period_id').references(() => monitoring_periods.id).notNull(),
  datasetHash: text('dataset_hash').notNull(),
  status: text('status').notNull().default('LOCKED'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const calculation_runs = pgTable('calculation_runs', {
  id: text('id').primaryKey(),
  datasetId: text('dataset_id').references(() => calculation_datasets.id).notNull(),
  methodologyVersionId: text('methodology_version_id').references(() => methodology_versions.id).notNull(),
  formulaVersion: text('formula_version').notNull(),
  status: text('status').notNull().default('CALCULATED'), // ESTIMATED, CALCULATED, VERIFIED, ISSUED
  resultTco2e: doublePrecision('result_tco2e').notNull(),
  calculationHash: text('calculation_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pdd = pgTable('pdd', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id).notNull(),
  status: text('status').notNull().default('DRAFT'), // DRAFT, SUBMITTED, APPROVED
  createdAt: timestamp('created_at').defaultNow(),
});

export const pdd_versions = pgTable('pdd_versions', {
  id: text('id').primaryKey(),
  pddId: text('pdd_id').references(() => pdd.id).notNull(),
  version: integer('version').notNull(),
  content: jsonb('content').notNull(), // structured PDD sections
  fileHash: text('file_hash'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const acva_cases = pgTable('acva_cases', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id).notNull(),
  type: text('type').notNull(), // VALIDATION, VERIFICATION
  status: text('status').notNull().default('OPEN'),
  auditorId: text('auditor_id').references(() => users.uid),
  createdAt: timestamp('created_at').defaultNow(),
});

export const findings = pgTable('findings', {
  id: text('id').primaryKey(),
  acvaCaseId: text('acva_case_id').references(() => acva_cases.id).notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('OPEN'), // OPEN, CORRECTED, CLOSED
  createdAt: timestamp('created_at').defaultNow(),
});

export const carbon_claims = pgTable('carbon_claims', {
  id: text('id').primaryKey(),
  calculationRunId: text('calculation_run_id').references(() => calculation_runs.id).notNull(),
  status: text('status').notNull().default('PENDING_VERIFICATION'), // PENDING_VERIFICATION, VERIFIED, REJECTED
  createdAt: timestamp('created_at').defaultNow(),
});

export const certificates = pgTable('certificates', {
  id: text('id').primaryKey(),
  carbonClaimId: text('carbon_claim_id').references(() => carbon_claims.id).notNull(),
  serialNumber: text('serial_number').notNull().unique(),
  status: text('status').notNull().default('ISSUED'), // ISSUED, AVAILABLE, TRANSFERRED, RETIRED
  issueDate: timestamp('issue_date').defaultNow(),
});
