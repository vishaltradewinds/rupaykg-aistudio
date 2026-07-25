export enum OperatingMode {
  URBAN = 'URBAN',
  RURAL = 'RURAL'
}

export enum EvidenceType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  WEIGHBRIDGE_SLIP = 'WEIGHBRIDGE_SLIP',
  INVOICE = 'INVOICE',
  DELIVERY_RECEIPT = 'DELIVERY_RECEIPT',
  GPS_TRACE = 'GPS_TRACE',
  SENSOR_DATA = 'SENSOR_DATA',
  METER_DATA = 'METER_DATA',
  LAB_REPORT = 'LAB_REPORT',
  DECLARATION = 'DECLARATION',
  DIGITAL_SIGNATURE = 'DIGITAL_SIGNATURE',
  EXTERNAL_RECORD = 'EXTERNAL_RECORD',
  OTHER = 'OTHER'
}

export enum EvidenceStatus {
  DATA_PRESENT = 'DATA_PRESENT',
  DATA_COMPLETE = 'DATA_COMPLETE',
  RULE_VALIDATED = 'RULE_VALIDATED',
  REVIEWED = 'REVIEWED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum MethodologyStatus {
  DISCOVERED = 'DISCOVERED',
  INGESTED = 'INGESTED',
  PARSED = 'PARSED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  DIGITIZED = 'DIGITIZED',
  TESTED = 'TESTED',
  APPROVED_INTERNAL = 'APPROVED_INTERNAL',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED'
}

export enum IntegrationStatus {
  NOT_CONFIGURED = 'NOT_CONFIGURED',
  CONFIGURED = 'CONFIGURED',
  SANDBOX = 'SANDBOX',
  MOCK = 'MOCK',
  CONNECTED = 'CONNECTED',
  DEGRADED = 'DEGRADED',
  UNAVAILABLE = 'UNAVAILABLE',
  ERROR = 'ERROR'
}

export enum FindingSeverity {
  OBSERVATION = 'OBSERVATION',
  CLARIFICATION = 'CLARIFICATION',
  DATA_GAP = 'DATA_GAP',
  NON_CONFORMITY = 'NON_CONFORMITY',
  MATERIAL_MISSTATEMENT_RISK = 'MATERIAL_MISSTATEMENT_RISK',
  CORRECTIVE_ACTION_REQUIRED = 'CORRECTIVE_ACTION_REQUIRED'
}

export enum FindingStatus {
  OPEN = 'OPEN',
  PROJECT_RESPONSE = 'PROJECT_RESPONSE',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED'
}

export enum JobStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  WAITING_FOR_REVIEW = 'WAITING_FOR_REVIEW',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum TrustMode {
  NATIVE = 'NATIVE',
  EXTERNAL_PROOF = 'EXTERNAL_PROOF',
  GUARDIAN = 'GUARDIAN',
  HYBRID = 'HYBRID'
}

export enum CCTSReadinessStatus {
  READY = 'READY',
  CONDITIONALLY_READY = 'CONDITIONALLY_READY',
  DATA_GAPS = 'DATA_GAPS',
  METHODOLOGY_REVIEW_REQUIRED = 'METHODOLOGY_REVIEW_REQUIRED',
  VERIFICATION_REQUIRED = 'VERIFICATION_REQUIRED',
  INTEGRATION_UNAVAILABLE = 'INTEGRATION_UNAVAILABLE'
}

export interface MRVEvent {
  eventId: string;
  projectId: string;
  operatingMode: OperatingMode;
  eventType: string; // e.g., 'COLLECTION', 'TRANSPORT', 'PROCESSING', 'DISPOSAL'
  sourceType: string;
  sourceId: string;
  actorId: string;
  organizationId: string;
  facilityId?: string;
  assetId?: string;
  batchId?: string;
  materialId?: string;
  timestamp: string;
  recordedAt: string;
  latitude: number;
  longitude: number;
  measurement: number;
  unit: string;
  evidenceRefs: string[]; // evidenceIds
  previousEventRef?: string;
  dataQuality: number; // 0 to 100
  verificationStatus: VerificationStatus;
  methodologyContext?: string;
  integrityHash: string;
  schemaVersion: string;
}

export interface ChainOfCustodyNode {
  id: string;
  label: string;
  type: string; // 'SOURCE' | 'COLLECTION' | 'TRANSPORT' | 'AGGREGATION' | 'PROCESSING' | 'FINAL_DESTINATION'
  timestamp: string;
  details: string;
  location?: string;
  quantity?: string;
}

export interface ChainOfCustodyLink {
  fromId: string;
  toId: string;
  type: string; // 'TRANSFER' | 'TRANSFORMATION' | 'SPLIT' | 'MERGE'
}

export interface ChainOfCustody {
  projectId: string;
  nodes: ChainOfCustodyNode[];
  links: ChainOfCustodyLink[];
}

export interface EvidenceRecord {
  evidenceId: string;
  projectId: string;
  eventId?: string;
  evidenceType: EvidenceType;
  source: string;
  fileReference: string;
  capturedAt: string;
  uploadedAt: string;
  actor: string;
  deviceId?: string;
  latitude?: number;
  longitude?: number;
  metadata: Record<string, any>;
  checksum: string;
  integrityHash: string;
  reviewStatus: string;
  verificationStatus: EvidenceStatus;
  confidentialityClass: 'PUBLIC' | 'CONFIDENTIAL' | 'RESTRICTED';
  retentionPolicy: string;
  schemaVersion: string;
}

export interface EvidencePackage {
  packageId: string;
  projectId: string;
  name: string;
  description: string;
  evidenceIds: string[];
  completenessScore: number; // 0 to 100
  status: EvidenceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EmissionFactor {
  factorId: string;
  name: string;
  description: string;
  activityType: string;
  materialType: string;
  geography: string;
  jurisdiction: string;
  value: number;
  unit: string;
  gas: string;
  gwpBasis: string;
  sourceAuthority: string;
  sourceDocument: string;
  sourceDocumentVersion: string;
  sourceReference: string;
  validFrom: string;
  validTo: string;
  status: string;
  classification: 'AUTHORITATIVE' | 'METHODOLOGY_DEFINED' | 'PROJECT_SPECIFIC' | 'THIRD_PARTY_REFERENCE' | 'INTERNAL_ASSUMPTION' | 'TEST_DATA';
  version: string;
}

export interface EquationDefinition {
  equationId: string;
  code: string;
  expression: string;
  description: string;
  parameters: string[]; // parameter codes
}

export interface ParameterDefinition {
  code: string;
  name: string;
  unit: string;
  valueType: 'NUMBER' | 'STRING' | 'BOOLEAN';
  defaultValue?: any;
  source: string;
}

export interface MethodologyIR {
  metadata: {
    methodologyId: string;
    methodologyCode: string;
    title: string;
    jurisdiction: string;
    program: string;
    sector: string;
    version: string;
    effectiveDate: string;
  };
  applicability: string[];
  roles: string[];
  entities: string[];
  parameters: ParameterDefinition[];
  equations: EquationDefinition[];
  dependencies: { target: string; sources: string[] }[];
  emissionFactors: string[]; // factorIds
  monitoringRules: string[];
  evidenceRules: string[];
  eligibilityRules: string[];
  calculationRules: string[];
  verificationRules: string[];
  workflow: string[];
  issuanceConditions: string[];
  reportingRequirements: string[];
  references: string[];
  version: string;
}

export interface Methodology {
  methodologyId: string;
  methodologyCode: string;
  title: string;
  jurisdiction: string;
  program: string;
  sector: string;
  activityType: string;
  version: string;
  effectiveDate: string;
  status: MethodologyStatus;
  sourceDocument: string;
  sourceAuthority: string;
  methodologyHash: string;
  digitizationStatus: string;
  policyCompilationStatus: string;
  calculationCoverage: number; // percentage
  evidenceCoverage: number; // percentage
  testCoverage: number; // percentage
  reviewStatus: string;
  ir?: MethodologyIR;
}

export interface CalculationRun {
  calculationRunId: string;
  projectId: string;
  monitoringPeriodId: string;
  methodologyId: string;
  methodologyVersion: string;
  equationVersion: string;
  inputSnapshot: Record<string, any>;
  emissionFactorSnapshot: Record<string, any>;
  parameterSnapshot: Record<string, any>;
  calculationSteps: string[];
  intermediateResults: Record<string, number>;
  finalResult: number;
  unit: string;
  uncertaintyResult: number;
  executedAt: string;
  engineVersion: string;
  calculationHash: string;
}

export interface Policy {
  policyId: string;
  name: string;
  version: string;
  status: string;
  compiledAt?: string;
  deployedAt?: string;
  hederaTopicId?: string;
  schemaMappingsCount: number;
  roleMappingsCount: number;
}

export interface RoleMapping {
  rupaykgRole: string;
  policyId: string;
  policyVersion: string;
  guardianRole: string;
  mappingStatus: string;
  approvedBy: string;
  version: string;
}

export interface SchemaMapping {
  rupaykgEntity: string;
  policyId: string;
  guardianSchema: string;
  fields: {
    rupaykgField: string;
    guardianField: string;
    unitMapping?: string;
    transformationRule?: string;
  }[];
}

export interface VerificationEngagement {
  engagementId: string;
  projectId: string;
  monitoringPeriodId: string;
  verifierOrganization: string;
  leadVerifier: string;
  status: 'INITIATED' | 'IN_PROGRESS' | 'COMPLETED' | 'TERMINATED';
  startDate: string;
  endDate?: string;
  verificationStatement?: string;
  digitalSignOffBy?: string;
  digitalSignOffAt?: string;
}

export interface VerificationFinding {
  findingId: string;
  engagementId: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
  requirementRef: string; // links to methodology or policy requirement
  evidenceRefs: string[]; // links to evidence IDs
  mrvRecordRefs: string[]; // links to MRV Record IDs
  calculationRunRef?: string; // links to Calculation Run
  reportedBy: string;
  reportedAt: string;
  projectResponse?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  history: {
    timestamp: string;
    actor: string;
    action: string;
    comment: string;
  }[];
}

export interface CCTSReadinessAssessment {
  assessmentId: string;
  projectId: string;
  assessedAt: string;
  assessedBy: string;
  status: CCTSReadinessStatus;
  overallScore: number; // 0 to 100
  requirementResults: {
    requirementId: string;
    category: string;
    title: string;
    description: string;
    status: 'MET' | 'PARTIALLY_MET' | 'NOT_MET' | 'NOT_APPLICABLE';
    evidenceLinked: boolean;
    calculationsVerified: boolean;
    remarks: string;
  }[];
}

export interface MassBalanceRecord {
  recordId: string;
  facilityId: string;
  materialType: string;
  monitoringPeriodId: string;
  openingStock: number;
  inputs: number;
  outputs: number;
  transformations: number;
  losses: number;
  rejections: number;
  closingStock: number;
  expectedBalance: number;
  observedBalance: number;
  variance: number;
  variancePercentage: number;
  status: 'BALANCED' | 'INVESTIGATION_REQUIRED' | 'INVESTIGATING' | 'RESOLVED';
  alerts: string[];
}

export interface AnomalyAlert {
  alertId: string;
  alertType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedRecords: string[]; // IDs
  reason: string;
  supportingSignals: string[];
  modelReference: string;
  modelVersion: string;
  createdAt: string;
  reviewStatus: 'PENDING' | 'INVESTIGATING' | 'FALSE_POSITIVE' | 'CONFIRMED';
  reviewDecision?: string;
}

export interface AuditEvent {
  auditEventId: string;
  eventType: string;
  actor: string;
  organization: string;
  resourceType: string;
  resourceId: string;
  action: string;
  timestamp: string;
  previousStateReference?: string; // stringified JSON or hash
  newStateReference?: string; // stringified JSON or hash
  reason?: string;
  requestId: string;
  correlationId: string;
  integrityHash: string;
}

export interface IntegrationCapability {
  name: string;
  provider: string;
  category: 'REGISTRY' | 'BLOCKCHAIN' | 'IOT' | 'EXTERNAL_API' | 'ANALYTICS';
  status: IntegrationStatus;
  mode: 'SANDBOX' | 'MOCK' | 'CONNECTED' | 'NOT_CONFIGURED';
  capabilities: string[];
  environment: string;
  lastHealthCheck: string;
  lastSuccessfulOperation?: string;
  errorStatus?: string;
  configurationStatus: string;
}

export interface Job {
  jobId: string;
  name: string;
  type: string;
  status: JobStatus;
  progress: number; // 0 to 100
  startedAt: string;
  completedAt?: string;
  actor: string;
  steps: {
    stepId: string;
    name: string;
    status: JobStatus;
    log?: string;
  }[];
  artifacts: {
    name: string;
    ref: string;
  }[];
}

// CPCB SWM & Bulk Waste Generator (BWG) Enterprise Operating System Types
export type BWGCategory = 
  | 'HOTEL_HOSPITALITY' 
  | 'COMMERCIAL_COMPLEX' 
  | 'EDUCATIONAL_INSTITUTION' 
  | 'HEALTHCARE_HOSPITAL' 
  | 'GATED_COMMUNITY_RWA' 
  | 'INDUSTRIAL_PARK' 
  | 'MUNICIPAL_GEN';

export type FourStreamType = 
  | 'WET_ORGANIC' 
  | 'DRY_RECYCLABLE' 
  | 'DOMESTIC_HAZARDOUS' 
  | 'SANITARY_REJECT';

export interface BWGEligibilityResult {
  category: BWGCategory;
  entityName: string;
  dailyWasteKg: number;
  builtUpAreaSqm: number;
  isMandatoryBWG: boolean;
  applicableRules: string[];
  mandatoryStreamCount: number;
  onSiteProcessingRequired: boolean;
  registrationStatus: 'REGISTERED_CPCB' | 'PENDING_REGISTRATION' | 'EXEMPT';
  complianceScore: number; // 0-100
}

export interface CPCBRenewalCalendarItem {
  id: string;
  title: string;
  filingType: 'ANNUAL_FORM_IV' | 'MONTHLY_LOGBOOK' | 'EBWGR_CERTIFICATE' | 'SPCB_PERMIT_RENEWAL' | 'SWM_AUDIT';
  dueDate: string;
  status: 'COMPLETED' | 'PENDING' | 'OVERDUE' | 'UNDER_REVIEW';
  regulatoryBody: string;
  documentRef?: string;
  lastUpdated: string;
}

export interface CPCBBwgLogEntry {
  id: string;
  date: string;
  stream: FourStreamType;
  wasteType: string;
  weightKg: number;
  trackingCode: string;
  vehicleNo: string;
  destinationFacility: string;
  weighbridgeRef?: string;
  evidencePhotoUrl?: string;
  geoLat?: number;
  geoLng?: number;
  co2eAvoidedKg: number;
  verifiedBy: string;
  status: 'VERIFIED' | 'FLAGGED' | 'DISPATCHED';
}

export interface CPCBSwmIntegrationStatus {
  portalName: string;
  category: 'GOVT_PORTAL' | 'SPCB_REGULATOR' | 'ULB_MUNICIPALITY' | 'PROCESSOR_RECYCLER' | 'ESG_REGISTRY';
  status: 'ACTIVE' | 'ASSISTED_SUBMISSION' | 'DIRECT_API' | 'PENDING_ONBOARDING';
  lastSync: string;
  totalSubmissions: number;
  endpointUrl: string;
}

