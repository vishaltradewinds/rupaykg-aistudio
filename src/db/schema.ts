import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, doublePrecision, boolean, jsonb, uuid, varchar, numeric } from 'drizzle-orm/pg-core';

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
  pddDocument: text('pdd_document'),
  registrationStatus: text('registration_status').notNull().default('INTERNAL'),
  icmReference: text('icm_reference'),
  validationStatus: text('validation_status'),
  verificationStatus: text('verification_status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const generic_cpas = pgTable('generic_cpas', {
  id: text('id').primaryKey(),
  programmeId: text('programme_id').references(() => carbon_programmes.id).notNull(),
  name: text('name').notNull(),
  activityType: text('activity_type'),
  technologyType: text('technology_type'),
  methodologyId: text('methodology_id'),
  baselineMethodology: text('baseline_methodology'),
  additionalityMethodology: text('additionality_methodology'),
  eligibilityCriteria: jsonb('eligibility_criteria').default([]),
  geographicCriteria: text('geographic_criteria'),
  monitoringRequirements: jsonb('monitoring_requirements').default([]),
  evidenceRequirements: jsonb('evidence_requirements').default([]),
  calculationMethod: text('calculation_method'),
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const component_project_activities = pgTable('component_project_activities', {
  id: text('id').primaryKey(),
  genericCpaId: text('generic_cpa_id').references(() => generic_cpas.id).notNull(),
  projectId: text('project_id'), // will reference carbon_projects below
  name: text('name').notNull(),
  operatorEntityId: text('operator_entity_id').references(() => legal_entities.id),
  siteId: text('site_id'),
  geographicalBoundary: jsonb('geographical_boundary'),
  startDate: timestamp('start_date'),
  creditingPeriod: integer('crediting_period_years'),
  technology: text('technology'),
  capacity: numeric('capacity'),
  baseline: jsonb('baseline'),
  monitoringPlan: jsonb('monitoring_plan'),
  status: text('status').notNull().default('DRAFT'),
  registrationStatus: text('registration_status').notNull().default('INTERNAL'),
  validationStatus: text('validation_status'),
  verificationStatus: text('verification_status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const carbon_projects = pgTable('carbon_projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  ownerId: text('owner_id').references(() => users.uid).notNull(),
  status: text('status').notNull().default('DRAFT'),
  methodologyId: text('methodology_id'),
  wasteSourceRecordId: text('waste_source_record_id').references(() => records.id),
  
  icmAccountId: text('icm_account_id').references(() => icm_accounts.id),
  programmeId: text('programme_id').references(() => carbon_programmes.id),
  genericCpaId: text('generic_cpa_id').references(() => generic_cpas.id),
  cpaId: text('cpa_id').references(() => component_project_activities.id),
  legalEntityId: text('legal_entity_id').references(() => legal_entities.id),
  
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
  officialCertificateIdentifier: text('official_certificate_identifier'),
  externalReference: text('external_reference'),
  status: text('status').notNull().default('CALCULATED'), // POTENTIAL, CALCULATED, VALIDATION_PENDING, VALIDATED, REGISTERED, MONITORING, VERIFICATION_PENDING, VERIFIED, ISSUANCE_REQUESTED, ADMINISTRATIVE_REVIEW, EXPERT_REVIEW, TECHNICAL_COMMITTEE_REVIEW, NSC_ICM_RECOMMENDATION, ISSUED, REJECTED, TRANSFERRED, RETIRED, CANCELLED
  issueDate: timestamp('issue_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- PHASE 5: REAL PILOT & EXTERNAL CCTS WORKFLOW TABLES ---

export const ccts_submissions = pgTable('ccts_submissions', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id).notNull(),
  submissionType: text('submission_type').notNull(), // PROJECT_REGISTRATION, VERIFICATION_ISSUANCE
  monitoringPeriodId: text('monitoring_period_id'),
  acvaId: text('acva_id'),
  documents: jsonb('documents').notNull().default([]),
  verificationReportUrl: text('verification_report_url'),
  submissionDate: timestamp('submission_date').defaultNow(),
  externalReference: text('external_reference'),
  status: text('status').notNull().default('DRAFT'), // DRAFT, READY, SUBMITTED, ACKNOWLEDGED, COMPLETENESS_REVIEW, EXPERT_REVIEW, TECHNICAL_COMMITTEE, NSC_ICM, ISSUANCE_CONFIRMED, REJECTED, QUERY_RAISED
  adapterType: text('adapter_type').notNull().default('MANUAL'), // MANUAL, OFFICIAL_API
  response: jsonb('response'),
  auditHash: text('audit_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const project_intakes = pgTable('project_intakes', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id).notNull(),
  projectOwner: text('project_owner').notNull(),
  legalEntity: text('legal_entity').notNull(),
  icmAccountStatus: text('icm_account_status').notNull(),
  facilityOwner: text('facility_owner').notNull(),
  facilityOperator: text('facility_operator').notNull(),
  siteLocation: text('site_location').notNull(),
  landfillInfo: jsonb('landfill_info').notNull().default({}),
  wasteHistory: jsonb('waste_history').notNull().default({}),
  gasCaptureInfra: jsonb('gas_capture_infra').notNull().default({}),
  flareUtilisationInfra: jsonb('flare_utilisation_infra').notNull().default({}),
  instrumentsList: jsonb('instruments_list').notNull().default([]),
  calibrationRecordsList: jsonb('calibration_records_list').notNull().default([]),
  monitoringSystem: jsonb('monitoring_system').notNull().default({}),
  landOwnershipRights: jsonb('land_ownership_rights').notNull().default({}),
  carbonBenefitOwnership: jsonb('carbon_benefit_ownership').notNull().default({}),
  applicablePermits: jsonb('applicable_permits').notNull().default([]),
  contracts: jsonb('contracts').notNull().default([]),
  existingEnvironmentalRecords: jsonb('existing_environmental_records').notNull().default([]),
  intakeStatus: text('intake_status').notNull().default('INCOMPLETE'), // INCOMPLETE, COMPLETE
  eligibilityAssessment: text('eligibility_assessment').notNull().default('INSUFFICIENT_DATA'), // ELIGIBLE_CANDIDATE, POTENTIALLY_ELIGIBLE, INSUFFICIENT_DATA, METHODOLOGY_GAP, NOT_ELIGIBLE
  eligibilityNotes: text('eligibility_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const legal_entities = pgTable('legal_entities', {
  id: text('id').primaryKey(),
  legalName: text('legal_name').notNull(),
  brandName: text('brand_name'),
  entityType: text('entity_type').notNull(),
  country: text('country'),
  registrationNumber: text('registration_number'),
  taxIdentifier: text('tax_identifier'),
  registeredAddress: text('registered_address'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  authorizedRepresentative: text('authorized_representative'),
  authorizedRepresentativeDesignation: text('authorized_representative_designation'),
  status: text('status').notNull().default('ACTIVE'),
  documents: jsonb('documents').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const icm_accounts = pgTable('icm_accounts', {
  id: text('id').primaryKey(),
  legalEntityId: text('legal_entity_id').references(() => legal_entities.id),
  entityName: text('entity_name').notNull(),
  accountRegistrationStatus: text('account_registration_status').notNull().default('PENDING'),
  entityType: text('entity_type').notNull(),
  authorizedRepresentative: text('authorized_representative').notNull(),
  documents: jsonb('documents').notNull().default([]),
  externalReference: text('external_reference'),
  accountId: text('account_id'),
  administratorReference: text('administrator_reference'),
  registrationDate: timestamp('registration_date'),
  approvalDate: timestamp('approval_date'),
  confirmedAt: timestamp('confirmed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const acva_registry = pgTable('acva_registry', {
  id: text('id').primaryKey(),
  agencyName: text('agency_name').notNull(),
  accreditationNumber: text('accreditation_number').notNull().unique(),
  accreditationType: text('accreditation_type').notNull(),
  mechanism: text('mechanism').notNull().default('CCTS_OFFSET'),
  sector: text('sector').notNull().default('WASTE_HANDLING_AND_DISPOSAL'),
  status: text('status').notNull().default('ACTIVE'), // ACTIVE, SUSPENDED, EXPIRED
  validFrom: timestamp('valid_from'),
  validTo: timestamp('valid_to'),
  sourceUrl: text('source_url'),
  sourceHash: text('source_hash'),
  lastRefreshedAt: timestamp('last_refreshed_at').defaultNow(),
});

export const acva_appointments = pgTable('acva_appointments', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id).notNull(),
  acvaRegistryId: text('acva_registry_id').references(() => acva_registry.id).notNull(),
  selectionReason: text('selection_reason').notNull(),
  conflictDeclarationPassed: boolean('conflict_declaration_passed').notNull().default(true),
  appointmentStatus: text('appointment_status').notNull().default('PROPOSED'), // PROPOSED, APPOINTED, DECLINED
  createdAt: timestamp('created_at').defaultNow(),
});

export const monitoring_reports = pgTable('monitoring_reports', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id).notNull(),
  monitoringPeriodId: text('monitoring_period_id').notNull(),
  methodologyId: text('methodology_id').notNull(),
  datasetId: text('dataset_id').notNull(),
  calculationRunId: text('calculation_run_id').notNull(),
  claimedTco2e: numeric('claimed_tco2e').notNull(),
  evidenceIndex: jsonb('evidence_index').notNull().default([]),
  qaQcSummary: text('qa_qc_summary').notNull(),
  deviations: text('deviations'),
  correctiveActions: text('corrective_actions'),
  status: text('status').notNull().default('DRAFT'), // DRAFT, FROZEN, SUBMITTED
  frozenAt: timestamp('frozen_at'),
  auditHash: text('audit_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const instrument_readiness = pgTable('instrument_readiness', {
  id: text('id').primaryKey(),
  facilityId: text('facility_id').references(() => facilities.id).notNull(),
  instrumentId: text('instrument_id').references(() => instruments.id).notNull(),
  installedStatus: boolean('installed_status').notNull().default(false),
  operationalStatus: boolean('operational_status').notNull().default(false),
  calibratedStatus: boolean('calibrated_status').notNull().default(false),
  traceableStatus: boolean('traceable_status').notNull().default(false),
  dataConnectedStatus: boolean('data_connected_status').notNull().default(false),
  readinessRating: text('readiness_rating').notNull().default('BLOCKED'), // READY, WARNING, BLOCKED
  notes: text('notes'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const audit_packages = pgTable('audit_packages', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id).notNull(),
  monitoringPeriodId: text('monitoring_period_id'),
  packageHash: text('package_hash').notNull(),
  downloadUrl: text('download_url'),
  includedEntities: jsonb('included_entities').notNull().default([]),
  generatedAt: timestamp('generated_at').defaultNow(),
  generatedBy: text('generated_by').notNull(),
});

// --- PHASE 3: PHYSICAL EVIDENCE INTEGRATION ---

export const weighbridge_records = pgTable('weighbridge_records', {
  id: text('id').primaryKey(),
  facilityId: text('facility_id').notNull().references(() => facilities.id),
  ticketNumber: varchar('ticket_number', { length: 255 }).notNull(),
  vehicleId: varchar('vehicle_id', { length: 255 }),
  grossWeight: numeric('gross_weight').notNull(),
  tareWeight: numeric('tare_weight').notNull(),
  netWeight: numeric('net_weight').notNull(),
  material: varchar('material', { length: 255 }).notNull(),
  timestamp: timestamp('timestamp').notNull(),
  sourceRecordId: text('source_record_id').references(() => records.id),
  evidenceHash: varchar('evidence_hash', { length: 255 }),
});

export const landfill_facilities = pgTable('landfill_facilities', {
  id: text('id').primaryKey(),
  facilityId: text('facility_id').notNull().references(() => facilities.id),
  landfillType: varchar('landfill_type', { length: 255 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  closureDate: timestamp('closure_date'),
  gasCaptureSystem: boolean('gas_capture_system').default(false),
  flare: boolean('flare').default(false),
  energyRecovery: boolean('energy_recovery').default(false),
});

export const waste_deposition_history = pgTable('waste_deposition_history', {
  id: text('id').primaryKey(),
  landfillFacilityId: text('landfill_facility_id').notNull().references(() => landfill_facilities.id),
  year: integer('year').notNull(),
  wasteType: varchar('waste_type', { length: 255 }).notNull(),
  quantity: numeric('quantity').notNull(),
  doc: numeric('doc'),
  docf: numeric('docf'),
  mcf: numeric('mcf'),
  k: numeric('k'),
  source: varchar('source', { length: 255 }),
  evidenceId: text('evidence_id').references(() => evidence.id),
});

export const gas_meter_readings = pgTable('gas_meter_readings', {
  id: text('id').primaryKey(),
  instrumentId: text('instrument_id').notNull().references(() => instruments.id),
  timestamp: timestamp('timestamp').notNull(),
  flow: numeric('flow').notNull(),
  unit: varchar('unit', { length: 50 }).notNull(), // e.g. m3/hr, Nm3/hr
  temperature: numeric('temperature'),
  pressure: numeric('pressure'),
  methaneFraction: numeric('methane_fraction'),
});

export const methane_measurements = pgTable('methane_measurements', {
  id: text('id').primaryKey(),
  instrumentId: text('instrument_id').notNull().references(() => instruments.id),
  timestamp: timestamp('timestamp').notNull(),
  reading: numeric('reading').notNull(),
  basis: varchar('basis', { length: 255 }), // wet or dry
  evidenceId: text('evidence_id').references(() => evidence.id),
});

export const electricity_meter_readings = pgTable('electricity_meter_readings', {
  id: text('id').primaryKey(),
  instrumentId: text('instrument_id').notNull().references(() => instruments.id),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  generationMwh: numeric('generation_mwh'),
  exportMwh: numeric('export_mwh'),
  consumptionMwh: numeric('consumption_mwh'),
  evidenceId: text('evidence_id').references(() => evidence.id),
});

export const pilot_issues = pgTable('pilot_issues', {
  id: text('id').primaryKey(),
  projectId: varchar('project_id', { length: 255 }).notNull(),
  issueType: varchar('issue_type', { length: 100 }).notNull(), // WEIGHBRIDGE_MISSING, CALIBRATION_EXPIRED, CARBON_RIGHTS_UNVERIFIED, LFG_FLOW_ANOMALY
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  impact: varchar('impact', { length: 100 }), // HIGH, MEDIUM, LOW
  rootCause: text('root_cause'),
  evidenceAccepted: text('evidence_accepted'),
  resolutionTimeHours: integer('resolution_time_hours'),
  acvaSatisfied: boolean('acva_satisfied').default(false),
  futureIntakeGuidanceUpdate: text('future_intake_guidance_update'),
  status: varchar('status', { length: 50 }).default('OPEN').notNull(), // OPEN, IN_PROGRESS, RESOLVED
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const bee_methodologies = pgTable('bee_methodologies', {
  id: text('id').primaryKey(),
  officialCode: text('official_code').notNull(),
  officialTitle: text('official_title').notNull(),
  version: text('version').notNull(),
  methodologyType: text('methodology_type'),
  applicability: text('applicability'),
  sourceDocument: text('source_document'),
  sourceUrl: text('source_url'),
  publicationDate: timestamp('publication_date'),
  effectiveDate: timestamp('effective_date'),
  status: text('status').notNull().default('ACTIVE'),
  calculationReference: text('calculation_reference'),
  monitoringRequirements: jsonb('monitoring_requirements'),
  evidenceRequirements: jsonb('evidence_requirements'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const carbon_rights = pgTable('carbon_rights', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id),
  cpaId: text('cpa_id').references(() => component_project_activities.id),
  rightsHolderEntityId: text('rights_holder_entity_id').references(() => legal_entities.id).notNull(),
  assetOwnerEntityId: text('asset_owner_entity_id').references(() => legal_entities.id),
  operatorEntityId: text('operator_entity_id').references(() => legal_entities.id),
  beneficiaryEntityId: text('beneficiary_entity_id').references(() => legal_entities.id),
  ownershipPercentage: numeric('ownership_percentage').notNull(),
  rightsType: text('rights_type').notNull(),
  agreementReference: text('agreement_reference'),
  agreementDocument: text('agreement_document'),
  effectiveDate: timestamp('effective_date'),
  expiryDate: timestamp('expiry_date'),
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const monitoring_periods = pgTable('monitoring_periods', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id),
  cpaId: text('cpa_id').references(() => component_project_activities.id),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: text('status').notNull().default('OPEN'),
  dataCompleteness: numeric('data_completeness').default('0'),
  evidenceCompleteness: numeric('evidence_completeness').default('0'),
  calculationStatus: text('calculation_status').default('PENDING'),
  verificationStatus: text('verification_status').default('PENDING'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const monitoring_datasets = pgTable('monitoring_datasets', {
  id: text('id').primaryKey(),
  monitoringPeriodId: text('monitoring_period_id').references(() => monitoring_periods.id).notNull(),
  parameter: text('parameter').notNull(),
  value: numeric('value').notNull(),
  unit: text('unit').notNull(),
  measurementMethod: text('measurement_method').notNull().default('MEASURED'), // MEASURED, CALCULATED, ESTIMATED, MODELLED, IMPORTED, USER_ENTERED
  instrumentId: text('instrument_id'),
  measurementTimestamp: timestamp('measurement_timestamp'),
  location: jsonb('location'),
  dataSource: text('data_source'),
  operator: text('operator'),
  qualityStatus: text('quality_status'),
  evidenceId: text('evidence_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const acva_engagements = pgTable('acva_engagements', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id),
  cpaId: text('cpa_id').references(() => component_project_activities.id),
  type: text('type').notNull().default('VALIDATION'), // VALIDATION, VERIFICATION
  acvaOrganisation: text('acva_organisation'),
  status: text('status').notNull().default('NOT_STARTED'),
  engagementDate: timestamp('engagement_date'),
  scope: text('scope'),
  report: text('report'),
  findings: jsonb('findings').default([]),
  correctiveActions: jsonb('corrective_actions').default([]),
  finalOpinion: text('final_opinion'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const mrv_packages = pgTable('mrv_packages', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => carbon_projects.id),
  cpaId: text('cpa_id').references(() => component_project_activities.id),
  monitoringPeriodId: text('monitoring_period_id').references(() => monitoring_periods.id),
  methodologyId: text('methodology_id'),
  baseline: jsonb('baseline'),
  additionality: jsonb('additionality'),
  monitoringDatasets: jsonb('monitoring_datasets'),
  calculations: jsonb('calculations'),
  evidence: jsonb('evidence'),
  massBalance: jsonb('mass_balance'),
  qaQc: jsonb('qa_qc'),
  doubleCounting: jsonb('double_counting'),
  carbonRights: jsonb('carbon_rights'),
  acvaStatus: text('acva_status'),
  documents: jsonb('documents'),
  hashes: jsonb('hashes'),
  version: integer('version').default(1),
  auditTrail: jsonb('audit_trail').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==========================================
// RUPAYKG ENTERPRISE 3.0: URBAN ARCHITECTURE
// ==========================================

export const urban_ulbs = pgTable('urban_ulbs', {
  id: text('id').primaryKey(),
  legalEntityId: text('legal_entity_id').references(() => legal_entities.id),
  name: text('name').notNull(),
  type: text('type').notNull(), // MUNICIPAL_CORPORATION, MUNICIPAL_COUNCIL, NAGAR_PANCHAYAT
  district: text('district').notNull(),
  state: text('state').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const urban_zones = pgTable('urban_zones', {
  id: text('id').primaryKey(),
  ulbId: text('ulb_id').references(() => urban_ulbs.id).notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const urban_wards = pgTable('urban_wards', {
  id: text('id').primaryKey(),
  zoneId: text('zone_id').references(() => urban_zones.id).notNull(),
  wardNumber: text('ward_number').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const urban_generators = pgTable('urban_generators', {
  id: text('id').primaryKey(),
  wardId: text('ward_id').references(() => urban_wards.id),
  type: text('type').notNull(), // HOUSEHOLD, COMMERCIAL, BULK_WASTE_GENERATOR, INSTITUTIONAL
  name: text('name'),
  rfidOrQr: text('rfid_or_qr'),
});

export const urban_collection_operators = pgTable('urban_collection_operators', {
  id: text('id').primaryKey(),
  legalEntityId: text('legal_entity_id').references(() => legal_entities.id),
  name: text('name').notNull(),
});

export const urban_transport_operators = pgTable('urban_transport_operators', {
  id: text('id').primaryKey(),
  legalEntityId: text('legal_entity_id').references(() => legal_entities.id),
  name: text('name').notNull(),
});

export const urban_vehicles = pgTable('urban_vehicles', {
  id: text('id').primaryKey(),
  transportOperatorId: text('transport_operator_id').references(() => urban_transport_operators.id),
  registrationNumber: text('registration_number').notNull(),
  type: text('type'),
  gpsEnabled: boolean('gps_enabled').default(false),
});

export const waste_manifests = pgTable('waste_manifests', {
  id: text('id').primaryKey(),
  generatorId: text('generator_id').references(() => urban_generators.id),
  collectionOperatorId: text('collection_operator_id').references(() => urban_collection_operators.id),
  transportOperatorId: text('transport_operator_id').references(() => urban_transport_operators.id),
  vehicleId: text('vehicle_id').references(() => urban_vehicles.id),
  weighbridgeRecordId: text('weighbridge_record_id'),
  destinationFacilityId: text('destination_facility_id').references(() => facilities.id),
  materialType: text('material_type').notNull(),
  weightKg: numeric('weight_kg'),
  collectedAt: timestamp('collected_at'),
  deliveredAt: timestamp('delivered_at'),
  status: text('status').notNull().default('IN_TRANSIT'), // IN_TRANSIT, DELIVERED, REJECTED, PROCESSED, RESIDUAL_DISPATCHED
});
