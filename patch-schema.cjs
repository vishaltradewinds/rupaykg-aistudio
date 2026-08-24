const fs = require('fs');

let schema = fs.readFileSync('src/db/schema.ts', 'utf8');

// Replace icm_accounts
schema = schema.replace(
  /export const icm_accounts = pgTable\('icm_accounts', \{[\s\S]*?\}\);/,
  `export const legal_entities = pgTable('legal_entities', {
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
});`
);

// Replace carbon_projects
schema = schema.replace(
  /export const carbon_projects = pgTable\('carbon_projects', \{[\s\S]*?\}\);/,
  `export const carbon_programmes = pgTable('carbon_programmes', {
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
});`
);

schema += `
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
`;

fs.writeFileSync('src/db/schema.ts', schema);
console.log('Schema patched successfully.');
