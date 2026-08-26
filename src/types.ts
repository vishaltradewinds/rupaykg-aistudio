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
  SIMULATED = 'SIMULATED',
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
  mode: 'SANDBOX' | 'SIMULATED' | 'CONNECTED' | 'NOT_CONFIGURED';
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

// =========================================================================
// RUPAYKG CARBON QUANTIFICATION ENGINE (CQE 1.0) CANONICAL TYPES
// =========================================================================

export enum CQEState {
  INGESTED = 'INGESTED',
  VALIDATED = 'VALIDATED',
  CHARACTERISED = 'CHARACTERISED',
  METHODOLOGY_SELECTED = 'METHODOLOGY_SELECTED',
  BASELINE_CALCULATED = 'BASELINE_CALCULATED',
  PROJECT_CALCULATED = 'PROJECT_CALCULATED',
  LEAKAGE_CALCULATED = 'LEAKAGE_CALCULATED',
  NET_TCO2E_CALCULATED = 'NET_TCO2E_CALCULATED',
  QAQC_PASSED = 'QAQC_PASSED',
  MRV_COMPLETE = 'MRV_COMPLETE',
  READY_FOR_ACVA = 'READY_FOR_ACVA',
  UNDER_ACVA_VERIFICATION = 'UNDER_ACVA_VERIFICATION',
  ACVA_VERIFIED = 'ACVA_VERIFIED',
  ISSUANCE_SUBMITTED = 'ISSUANCE_SUBMITTED',
  CCC_ISSUED = 'CCC_ISSUED',
  TRADEABLE = 'TRADEABLE',
  TRANSFERRED = 'TRANSFERRED',
  RETIRED = 'RETIRED'
}

export type PricingType = 
  | 'SCENARIO_PRICE'
  | 'MARKET_PRICE'
  | 'INDICATIVE_PRICE'
  | 'CONTRACT_PRICE'
  | 'EXCHANGE_PRICE'
  | 'BUYER_OFFER'
  | 'AUCTION_PRICE'
  | 'HISTORICAL_PRICE';

export interface CQEActivityData {
  activityId: string;
  grossVehicleWeightKg: number;
  tareWeightKg: number;
  netMaterialKg: number;
  materialCategory: string;
  facilityId: string;
  facilityName: string;
  vehicleId: string;
  weighbridgeId: string;
  timestamp: string;
  geoLat: number;
  geoLong: number;
  source: string;
  destination: string;
  batchId: string;
  chainOfCustodyHash: string;
}

export interface CQEMaterialCharacterisation {
  totalWeightKg: number;
  compositionType: string;
  organicFraction: number; // e.g. 0.65 (65%)
  moisturePercent: number; // e.g. 45 (%)
  dryMatterPercent: number; // 100 - moisture
  degradableOrganicCarbon: number; // DOC_j (fraction)
  fossilCarbonFraction?: number;
  methaneGenerationPotential_L0?: number; // m3 CH4 / tonne
  treatmentEfficiency: number; // fraction 0-1
  isCharacterised: boolean;
  characterisationSource: 'LAB_ASSAY' | 'METHODOLOGY_DEFAULT' | 'SAMPLED_WASTE_AUDIT';
}

export interface CQEMethodologyDefinition {
  methodologyId: string;
  methodologyCode: string;
  title: string;
  description?: string;
  version: string;
  sector: string;
  sourceType?: 'SYSTEM_REFERENCE' | 'CUSTOM' | 'BEE_OFFICIAL' | 'IMPORTED' | string;
  applicability: string[];
  baselineRules: string;
  projectRules: string;
  leakageRules: string;
  monitoringRequirements: string[];
  parameters: {
    name: string;
    code: string;
    unit: string;
    defaultValue?: number;
    description: string;
    source: string;
  }[];
  emissionFactors: {
    name: string;
    code: string;
    value: number;
    unit: string;
    source: string;
  }[];
  toolsRequired: string[];
  creditingPeriodRules: string;
  effectiveDate: string;
  status: 'ACTIVE' | 'SUPERSEDED' | 'PROPOSED' | 'RETIRED' | 'DRAFT';
  sourceDocument: string;
  sourceReference?: string;
  evidenceReference?: string;
  issuer: string;
  changelog?: string;
  baselineEquationLatex?: string;
  projectEquationLatex?: string;
  leakageEquationLatex?: string;
  acvaAccreditationStandard?: string;
  tenantId?: string;
  approvedBy?: string;
  approvedAt?: string;
  metadata?: Record<string, any>;
  supersededBy?: string;
  lastUpdated?: string;
  uploadedBy?: string;
}

export interface CQEQAQCAnomaly {
  code: string;
  severity: 'INFO' | 'WARNING' | 'BLOCKING';
  layer: number;
  parameter: string;
  detectedValue: any;
  thresholdOrRule: string;
  description: string;
  isPassed: boolean;
}

export interface CQEQAQCResult {
  isPassed: boolean;
  completenessScore: number; // 0-100
  consistencyScore: number; // 0-100
  conservativeDeductionPercent: number; // e.g. 5% if high uncertainty
  anomalies: CQEQAQCAnomaly[];
  auditTimestamp: string;
  aiAnomalyDetection: {
    model: string;
    anomalyFlagged: boolean;
    confidence: number;
    notes: string;
  };
}

export interface CQEEvidenceVaultRecord {
  activityId: string;
  weighbridgeSlipRef: string;
  photoRefs: string[];
  gpsTraceHash: string;
  vehicleTelemetryHash: string;
  facilityLogRef: string;
  labReportRef?: string;
  fuelConsumptionRef?: string;
  electricityMeterRef?: string;
  treatmentRecordRef: string;
  calculationVersion: string;
  methodologyVersion: string;
  evidenceHashes: string[];
  rootProvenanceHash: string;
  hederaAnchor?: {
    topicId: string;
    consensusTimestamp: string;
    sequenceNumber: number;
    transactionId: string;
  };
}

export interface CQEWaterfallBreakdown {
  grossProceedsInr: number;
  transactionCostsInr: number; // 1.0% (Banking & Escrow Floor)
  registryIssuanceCostsInr: number; // 1.5% (Statutory CCTS Minimum)
  acvaValidationVerificationCostsInr: number; // 2.5% (Independent ACVA/VVB Scaled Audit Floor)
  projectOwnerShareInr: number; // 35.0% (ULB / Concessionaire Statutory Floor)
  generatorAggregatorShareInr: number; // 5.0% (Community / FPO / Safai Mitra Dividend Floor)
  financierShareInr: number; // 2.0% (Green Debt Concession Floor)
  rupayKgRevenueInr: number; // 53.0% (Platform Net Retained Operating Revenue - Maximized)
}

export interface CQEQuantificationTrace {
  activityId: string;
  methodologyCode: string;
  methodologyVersion: string;
  currentState: CQEState;
  
  // Layer 4: Baseline
  baselineEmissionsTco2e: number;
  baselineBreakdown: Record<string, number>;
  
  // Layer 5: Project Emissions
  projectEmissionsTco2e: number;
  projectEmissionsBreakdown: {
    peFuel: number;
    peElectricity: number;
    peTransport: number;
    peProcess: number;
  };
  
  // Layer 6: Leakage
  leakageEmissionsTco2e: number;
  leakageBreakdown: Record<string, number>;
  
  // Layer 7: Net Quantified
  grossReductionTco2e: number;
  uncertaintyDeductionTco2e: number;
  netVerifiedEligibleTco2e: number;
  
  // Layer 8: QA/QC
  qaqcResult: CQEQAQCResult;
  
  // Layer 9: Vault
  evidenceVault: CQEEvidenceVaultRecord;
  
  // Layer 10 & 11: Verification & CCC
  acvaVerifierOrganization?: string;
  acvaVerificationDate?: string;
  icmRegistryReference?: string;
  issuedCccQuantity: number; // 1 CCC = 1 tCO2e
  isTradeable: boolean;
  
  // Layer 12: Market Pricing & Waterfall
  pricingType: PricingType;
  scenarioPricePerCccInr: number; // Scenario price (not hardcoded default)
  grossCarbonValueInr: number;
  waterfallBreakdown?: CQEWaterfallBreakdown;
  
  calculatedAt: string;
  calculationHash: string;
}

export interface CQEThreeLedgersRecord {
  recordId: string;
  activityId: string;
  
  // 1. Material Ledger
  materialLedger: {
    netWeightKg: number;
    netWeightTonnes: number;
    grossWeightKg: number;
    tareWeightKg: number;
    materialCategory: string;
    facilityId: string;
    vehicleId: string;
    weighbridgeId: string;
    batchId: string;
    timestamp: string;
  };
  
  // 2. Carbon Ledger
  carbonLedger: {
    quantifiedTco2e: number;
    baselineEmissionsTco2e: number;
    projectEmissionsTco2e: number;
    leakageEmissionsTco2e: number;
    methodologyCode: string;
    cqeState: CQEState;
    acvaStatus: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
    icmCccIssuedQuantity: number;
    isIcmRegistryIssued: boolean;
    hederaProvenanceHash: string;
  };
  
  // 3. Financial Ledger
  financialLedger: {
    materialSettlement: {
      totalMaterialValueInr: number;
      generatorPayoutInr: number;
      aggregatorPayoutInr: number;
      platformMaterialHandlingFeeInr: number;
      settlementStatus: 'PENDING' | 'SETTLED' | 'ESCROW';
    };
    carbonCommoditySettlement: {
      pricingType: PricingType;
      unitPricePerCccInr: number;
      totalCarbonValueInr: number;
      isCccSold: boolean;
      carbonRevenueAccruedTo: 'platform_treasury' | 'project_owner' | 'pending_sale';
      waterfall?: CQEWaterfallBreakdown;
    };
  };
}

