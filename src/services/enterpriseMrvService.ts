import {
  OperatingMode,
  MRVEvent,
  ChainOfCustody,
  EvidenceRecord,
  EvidencePackage,
  EmissionFactor,
  Methodology,
  MethodologyIR,
  CalculationRun,
  Policy,
  RoleMapping,
  SchemaMapping,
  VerificationEngagement,
  VerificationFinding,
  CCTSReadinessAssessment,
  MassBalanceRecord,
  AnomalyAlert,
  AuditEvent,
  IntegrationCapability,
  Job,
  JobStatus,
  FindingSeverity,
  FindingStatus,
  MethodologyStatus,
  IntegrationStatus,
  EvidenceStatus,
  VerificationStatus,
  TrustMode,
  CCTSReadinessStatus,
  EvidenceType
} from '../types';

import { GoogleGenAI } from '@google/genai';
import { hashStringHex } from '../utils/cryptoUtils';

// Simple helper to generate IDs
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// In-memory / LocalStorage State Store
class EnterpriseMrvStore {
  public mrvEvents: MRVEvent[] = [];
  public evidenceRecords: EvidenceRecord[] = [];
  public evidencePackages: EvidencePackage[] = [];
  public emissionFactors: EmissionFactor[] = [];
  public methodologies: Methodology[] = [];
  public calculationRuns: CalculationRun[] = [];
  public policies: Policy[] = [];
  public roleMappings: RoleMapping[] = [];
  public schemaMappings: SchemaMapping[] = [];
  public engagements: VerificationEngagement[] = [];
  public findings: VerificationFinding[] = [];
  public assessments: CCTSReadinessAssessment[] = [];
  public massBalances: MassBalanceRecord[] = [];
  public alerts: AnomalyAlert[] = [];
  public auditEvents: AuditEvent[] = [];
  public integrations: IntegrationCapability[] = [];
  public jobs: Job[] = [];

  constructor() {
    this.loadFromStorage();
    if (this.methodologies.length === 0) {
      this.seedInitialData();
    }
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem('rupaykg_enterprise_store');
      if (data) {
        const parsed = JSON.parse(data);
        this.mrvEvents = parsed.mrvEvents || [];
        this.evidenceRecords = parsed.evidenceRecords || [];
        this.evidencePackages = parsed.evidencePackages || [];
        this.emissionFactors = parsed.emissionFactors || [];
        this.methodologies = parsed.methodologies || [];
        this.calculationRuns = parsed.calculationRuns || [];
        this.policies = parsed.policies || [];
        this.roleMappings = parsed.roleMappings || [];
        this.schemaMappings = parsed.schemaMappings || [];
        this.engagements = parsed.engagements || [];
        this.findings = parsed.findings || [];
        this.assessments = parsed.assessments || [];
        this.massBalances = parsed.massBalances || [];
        this.alerts = parsed.alerts || [];
        this.auditEvents = parsed.auditEvents || [];
        this.integrations = parsed.integrations || [];
        this.jobs = parsed.jobs || [];
      }
    } catch (e) {
      console.error('Failed to load RupayKg enterprise store:', e);
    }
  }

  public saveToStorage() {
    try {
      const data = JSON.stringify({
        mrvEvents: this.mrvEvents,
        evidenceRecords: this.evidenceRecords,
        evidencePackages: this.evidencePackages,
        emissionFactors: this.emissionFactors,
        methodologies: this.methodologies,
        calculationRuns: this.calculationRuns,
        policies: this.policies,
        roleMappings: this.roleMappings,
        schemaMappings: this.schemaMappings,
        engagements: this.engagements,
        findings: this.findings,
        assessments: this.assessments,
        massBalances: this.massBalances,
        alerts: this.alerts,
        auditEvents: this.auditEvents,
        integrations: this.integrations,
        jobs: this.jobs
      });
      localStorage.setItem('rupaykg_enterprise_store', data);
    } catch (e) {
      console.error('Failed to save RupayKg enterprise store:', e);
    }
  }

  private seedInitialData() {
    // Initial Emission Factors
    this.emissionFactors = [
      {
        factorId: 'EF_MSW_01',
        name: 'Landfill Avoided Methane Factor',
        description: 'Methane potential for avoided municipal wet waste dumping',
        activityType: 'LANDFILL_DIVERSION',
        materialType: 'Municipal Organic Waste',
        geography: 'India',
        jurisdiction: 'National',
        value: 12.4,
        unit: 'kg CO2e / kg waste',
        gas: 'CH4',
        gwpBasis: 'AR6',
        sourceAuthority: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
        sourceDocument: 'India National GHG Inventory Reference Guide',
        sourceDocumentVersion: '2024.1',
        sourceReference: 'Section 4.2: Solid Waste Disposal',
        validFrom: '2024-01-01',
        validTo: '2028-12-31',
        status: 'Active',
        classification: 'AUTHORITATIVE',
        version: '1.0'
      },
      {
        factorId: 'EF_TRANSPORT_DSR',
        name: 'Diesel Transport Emission Factor',
        description: 'Emissions per km for heavy diesel vehicles',
        activityType: 'TRANSPORTATION',
        materialType: 'Diesel',
        geography: 'India',
        jurisdiction: 'National',
        value: 2.68,
        unit: 'kg CO2e / L',
        gas: 'CO2',
        gwpBasis: 'AR6',
        sourceAuthority: 'Bureau of Energy Efficiency (BEE)',
        sourceDocument: 'PAT Scheme Reference Standards',
        sourceDocumentVersion: 'v2',
        sourceReference: 'Table 5: Fossil Fuel Emission Factors',
        validFrom: '2023-01-01',
        validTo: '2030-12-31',
        status: 'Active',
        classification: 'AUTHORITATIVE',
        version: '2.0'
      },
      {
        factorId: 'EF_AGRI_STUBBLE_01',
        name: 'Avoided Open Burn Crop Residue',
        description: 'Baseline emission factor for burning crop stubble open field',
        activityType: 'CROP_RESIDUE_AGGREGATION',
        materialType: 'Rice Stubble',
        geography: 'Punjab, India',
        jurisdiction: 'Regional',
        value: 1.45,
        unit: 'kg CO2e / kg biomass',
        gas: 'CO2, N2O, CH4',
        gwpBasis: 'AR5',
        sourceAuthority: 'Indian Council of Agricultural Research (ICAR)',
        sourceDocument: 'Crop Residue Management Study Guide',
        sourceDocumentVersion: 'v1.4',
        sourceReference: 'Stubble Burn Emission Inventory, Table 2.1',
        validFrom: '2023-10-01',
        validTo: '2027-09-30',
        status: 'Active',
        classification: 'METHODOLOGY_DEFINED',
        version: '1.1'
      }
    ];

    // Initial Methodologies
    this.methodologies = [
      {
        methodologyId: 'METH_URBAN_COMPOST',
        methodologyCode: 'ACM0022',
        title: 'Alternative waste treatment processes - Composting and Landfill Diversion',
        jurisdiction: 'India & International',
        program: 'Clean Development Mechanism (CDM) / CCTS',
        sector: 'Waste Management',
        activityType: 'Composting / Biomethanation',
        version: '12.0',
        effectiveDate: '2022-06-01',
        status: MethodologyStatus.ACTIVE,
        sourceDocument: 'https://cdm.unfccc.int/methodologies/DB/ACM0022',
        sourceAuthority: 'UNFCCC CDM Executive Board',
        methodologyHash: 'sha256_3b8a1c9d2f0e7a8b...',
        digitizationStatus: 'Digitized',
        policyCompilationStatus: 'Compiled',
        calculationCoverage: 95,
        evidenceCoverage: 100,
        testCoverage: 90,
        reviewStatus: 'Approved Internally',
        ir: {
          metadata: {
            methodologyId: 'METH_URBAN_COMPOST',
            methodologyCode: 'ACM0022',
            title: 'Alternative waste treatment processes - Composting',
            jurisdiction: 'India & International',
            program: 'CDM',
            sector: 'Waste Management',
            version: '12.0',
            effectiveDate: '2022-06-01'
          },
          applicability: [
            'Municipal Solid Waste diversion from landfills',
            'Processing through aerobic composting',
            'Verification of weighbridge records and photos required'
          ],
          roles: ['Project Developer', 'Verifier', 'Data Collector', 'Registry Operator'],
          entities: ['Facility', 'Weighbridge', 'CompostBatch'],
          parameters: [
            { code: 'W_j', name: 'Quantity of organic waste treated', unit: 'tonnes', valueType: 'NUMBER', source: 'Weighbridge' },
            { code: 'EF_comb', name: 'Emission factor for waste composting', unit: 'kg CO2e / tonne', valueType: 'NUMBER', defaultValue: 1.5, source: 'Emission Registry' },
            { code: 'PE_transport', name: 'Project emissions from transport', unit: 'kg CO2e', valueType: 'NUMBER', defaultValue: 0, source: 'Activity Events' }
          ],
          equations: [
            { equationId: 'EQ_01', code: 'BE_y', expression: 'W_j * EF_comb * 28', description: 'Baseline avoided emissions from organic waste degradation', parameters: ['W_j', 'EF_comb'] },
            { equationId: 'EQ_02', code: 'ER_y', expression: 'BE_y - PE_transport', description: 'Net emission reductions after transport leakage deduction', parameters: ['BE_y', 'PE_transport'] }
          ],
          dependencies: [
            { target: 'EQ_02', sources: ['EQ_01'] }
          ],
          emissionFactors: ['EF_MSW_01'],
          monitoringRules: ['Continuous weighbridge monitoring', 'Staggered site GPS photos weekly'],
          evidenceRules: ['Weighbridge slip upload with digital signature', 'GPS location check matches boundary within 10 meters'],
          eligibilityRules: ['Waste must not have been composted prior to project start', 'The composting facility must operate within municipal laws'],
          calculationRules: ['Baseline calculated dynamically per daily batch', 'Project emissions calculated using vehicle distance trace'],
          verificationRules: ['Sample reviews on 10% of random weighbridge slips', 'Quarterly remote satellite boundary check'],
          workflow: ['Draft', 'Internal Review', 'Registry Submission', 'Active Issuance'],
          issuanceConditions: ['Data Quality score exceeds 80', 'No active critical non-conformity findings open'],
          reportingRequirements: ['Quarterly Monitoring Report PDF', 'Full trace CSV of physical weighbridge receipts'],
          references: ['UNFCCC ACM0022 standard guidelines'],
          version: '1.0'
        }
      },
      {
        methodologyId: 'METH_RURAL_BIOMASS',
        methodologyCode: 'AMS-III.E',
        title: 'Avoidance of methane production from decay of biomass through aggregation',
        jurisdiction: 'India & Regional',
        program: 'CDM Small-Scale / CCTS',
        sector: 'Agriculture & Biomass',
        activityType: 'Crop Residue Aggregation & Biomethanation',
        version: '10.0',
        effectiveDate: '2023-01-15',
        status: MethodologyStatus.ACTIVE,
        sourceDocument: 'https://cdm.unfccc.int/methodologies/DB/AMS-III.E',
        sourceAuthority: 'UNFCCC CDM Executive Board',
        methodologyHash: 'sha256_4e9b8f2c3d1a0e5c...',
        digitizationStatus: 'Digitized',
        policyCompilationStatus: 'Compiled',
        calculationCoverage: 90,
        evidenceCoverage: 85,
        testCoverage: 80,
        reviewStatus: 'Approved Internally',
        ir: {
          metadata: {
            methodologyId: 'METH_RURAL_BIOMASS',
            methodologyCode: 'AMS-III.E',
            title: 'Aggregation of Biomass for Stubble Burn Avoidance',
            jurisdiction: 'India & Regional',
            program: 'CDM',
            sector: 'Agriculture',
            version: '10.0',
            effectiveDate: '2023-01-15'
          },
          applicability: [
            'Aggregation of crop residues from smallholder fields',
            'Avoids open-field residue burning (stubble burning)',
            'Tracing of farmer participants and biomass weights'
          ],
          roles: ['FPO Operator', 'Farmer Participant', 'Verifier', 'Platform Admin'],
          entities: ['FarmerGroup', 'AggregationCenter', 'BalerAsset'],
          parameters: [
            { code: 'B_agg', name: 'Biomass stubble aggregated', unit: 'tonnes', valueType: 'NUMBER', source: 'Receipts' },
            { code: 'EF_burn', name: 'Stubble open field burn emission factor', unit: 'kg CO2e / tonne', valueType: 'NUMBER', defaultValue: 1450, source: 'Emission Factors' },
            { code: 'PE_diesel', name: 'Project emissions from balers and logistics', unit: 'kg CO2e', valueType: 'NUMBER', defaultValue: 0, source: 'Fuel Consumption' }
          ],
          equations: [
            { equationId: 'EQ_01', code: 'BE_biomass', expression: 'B_agg * EF_burn', description: 'Baseline avoided burning emissions', parameters: ['B_agg', 'EF_burn'] },
            { equationId: 'EQ_02', code: 'ER_net', expression: 'BE_biomass - PE_diesel', description: 'Net avoided emission credits from stubble diversion', parameters: ['BE_biomass', 'PE_diesel'] }
          ],
          dependencies: [{ target: 'EQ_02', sources: ['EQ_01'] }],
          emissionFactors: ['EF_AGRI_STUBBLE_01'],
          monitoringRules: ['Farmer identification codes', 'Traceable batch weights from field balers'],
          evidenceRules: ['Farmer declaration slip', 'Rake activity GPS log with timestamp'],
          eligibilityRules: ['Fields must have history of stubble burning', 'Aggregation occurs within 60 days of crop harvest'],
          calculationRules: ['Avoided emissions calculated from biomass weight', 'Diesel fuel project emissions subtracted daily'],
          verificationRules: ['Verify active crop cultivation via optical Sentinel imagery', 'Trace FPO payout records matching weight receipt amounts'],
          workflow: ['Draft', 'FPO Verified', 'Ready for Issuance'],
          issuanceConditions: ['Farmer consent and receipt records are valid', 'Mass balance check on aggregated batches within 5% variance'],
          reportingRequirements: ['Farmer Traceability Audit Log', 'Biomass Inventory ledger'],
          references: ['AMS-III.E clean methodologies'],
          version: '1.0'
        }
      }
    ];

    // Initial Verification Engagement
    this.engagements = [
      {
        engagementId: 'ENG_001',
        projectId: 'PRJ_MUNICIPAL_EAST',
        monitoringPeriodId: 'MP_2026_Q1',
        verifierOrganization: 'ClimateVerify India Pvt Ltd',
        leadVerifier: 'Dr. Suresh R. Mehta',
        status: 'IN_PROGRESS',
        startDate: '2026-04-01'
      }
    ];

    // Initial Verification Findings
    this.findings = [
      {
        findingId: 'FND_001',
        engagementId: 'ENG_001',
        title: 'Missing Weighbridge Slip for Batch B-402',
        description: 'Physical weighbridge slip for wet waste batch recorded on March 14, 2026, was not uploaded into the Evidence Repository. Baseline calculations of 2.4 tonnes are currently unverified.',
        severity: FindingSeverity.NON_CONFORMITY,
        status: FindingStatus.OPEN,
        requirementRef: 'ACM0022 Evidence rule 1: Weighbridge slips mandatory',
        evidenceRefs: [],
        mrvRecordRefs: ['MRV_EVENT_2026_03_14_A'],
        reportedBy: 'Dr. Suresh R. Mehta',
        reportedAt: '2026-04-10T11:30:00Z',
        projectResponse: 'Analyzing archive files to retrieve scanned receipt copy.',
        history: [
          { timestamp: '2026-04-10T11:30:00Z', actor: 'Dr. Suresh R. Mehta', action: 'Reported', comment: 'Audit sampling found missing file.' }
        ]
      }
    ];

    // Initial Integration Capabilities
    this.integrations = [
      {
        name: 'Hedera Guardian Policy Engine',
        provider: 'Envision Blockchain / Hedera',
        category: 'BLOCKCHAIN',
        status: IntegrationStatus.SANDBOX,
        mode: 'SANDBOX',
        capabilities: ['Policy Deployment', 'VC Issuance', 'Schema Compilation', 'VP Verifier Verification'],
        environment: 'Hedera Testnet (v3.0.1)',
        lastHealthCheck: '7/11/2026, 9:15:00 AM',
        lastSuccessfulOperation: '7/11/2026, 9:02:14 AM',
        configurationStatus: 'Enabled'
      },
      {
        name: 'Indian CCTS Registry Gateway',
        provider: 'Bureau of Energy Efficiency (BEE)',
        category: 'REGISTRY',
        status: IntegrationStatus.NOT_CONFIGURED,
        mode: 'SIMULATED',
        capabilities: ['Project Registration', 'CCTS Token Allocation', 'Compliance Checking'],
        environment: 'Development Sandbox',
        lastHealthCheck: '7/11/2026, 9:00:00 AM',
        configurationStatus: 'Awaiting BEE Official API Credentials'
      },
      {
        name: 'Sentinel-2 Satellite Verification Engine',
        provider: 'Copernicus Space / GeoServer',
        category: 'ANALYTICS',
        status: IntegrationStatus.CONNECTED,
        mode: 'CONNECTED',
        capabilities: ['Vegetation Indices', 'Stubble Fire Detection', 'Municipal Boundary Monitoring'],
        environment: 'Production Hub',
        lastHealthCheck: '7/11/2026, 9:18:32 AM',
        lastSuccessfulOperation: '7/11/2026, 8:58:33 AM',
        configurationStatus: 'Configured'
      }
    ];

    // Initial Policies
    this.policies = [
      {
        policyId: 'POL_ACM0022_V1',
        name: 'ACM0022 - Composting Policy',
        version: '1.0',
        status: 'Active',
        compiledAt: '2026-01-15T08:00:00Z',
        deployedAt: '2026-01-15T09:12:00Z',
        hederaTopicId: '0.0.1837492',
        schemaMappingsCount: 4,
        roleMappingsCount: 3
      }
    ];

    // Initial Role Mappings
    this.roleMappings = [
      {
        rupaykgRole: 'MUNICIPAL_OPERATOR',
        policyId: 'POL_ACM0022_V1',
        policyVersion: '1.0',
        guardianRole: 'DataCollector',
        mappingStatus: 'Mapped & Verified',
        approvedBy: 'Platform Admin',
        version: '1.0'
      },
      {
        rupaykgRole: 'VERIFIER',
        policyId: 'POL_ACM0022_V1',
        policyVersion: '1.0',
        guardianRole: 'AuditorVerifier',
        mappingStatus: 'Mapped & Verified',
        approvedBy: 'Platform Admin',
        version: '1.0'
      }
    ];

    // Initial Schema Mappings
    this.schemaMappings = [
      {
        rupaykgEntity: 'MRVEvent',
        policyId: 'POL_ACM0022_V1',
        guardianSchema: 'MunicipalActivityRecord',
        fields: [
          { rupaykgField: 'measurement', guardianField: 'tonnesQuantity' },
          { rupaykgField: 'recordedAt', guardianField: 'timestamp' },
          { rupaykgField: 'latitude', guardianField: 'geoLatitude' },
          { rupaykgField: 'longitude', guardianField: 'geoLongitude' }
        ]
      }
    ];

    // Initial Audit Events
    this.auditEvents = [
      {
        auditEventId: 'AUD_001',
        eventType: 'POLICY_DEPLOYMENT',
        actor: 'Super Admin',
        organization: 'RupayKg Central',
        resourceType: 'Policy',
        resourceId: 'POL_ACM0022_V1',
        action: 'Deploy To Hedera Testnet',
        timestamp: '2026-01-15T09:12:00Z',
        requestId: 'req_0192837a',
        correlationId: 'corr_3b9f8d1c',
        integrityHash: 'sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }
    ];

    // Initial MRV Events & Evidence
    this.seedInitialActivityData();

    this.saveToStorage();
  }

  private seedInitialActivityData() {
    this.mrvEvents = [];
    this.evidenceRecords = [];
    this.evidencePackages = [];
    this.massBalances = [];
    this.alerts = [];
  }
}

// Instantiate Global Single Store
export const enterpriseStore = new EnterpriseMrvStore();

// ========================================================
// CORE ENTERPRISE MRV SERVICES
// ========================================================

export const enterpriseMrvService = {
  // 1. MRV Event Management
  getMrvEvents: (): MRVEvent[] => {
    return enterpriseStore.mrvEvents;
  },

  addMrvEvent: (event: Omit<MRVEvent, 'eventId' | 'recordedAt' | 'integrityHash'>): MRVEvent => {
    const recordedAt = new Date().toISOString();
    const eventId = generateId('MRV_EVT');
    const integrityHash = hashStringHex(`${eventId}:${recordedAt}:${JSON.stringify(event)}`);
    const newEvent: MRVEvent = {
      ...event,
      eventId,
      recordedAt,
      integrityHash,
      dataQuality: event.evidenceRefs.length * 40 + 15 > 100 ? 100 : event.evidenceRefs.length * 40 + 15
    };
    enterpriseStore.mrvEvents.unshift(newEvent);

    // Create Audit Log Event
    enterpriseMrvService.logAudit({
      eventType: 'MRV_EVENT_CREATION',
      actor: event.actorId,
      organization: 'Local Authority',
      resourceType: 'MRVEvent',
      resourceId: newEvent.eventId,
      action: 'Created Canonical MRV Event record',
      newStateReference: JSON.stringify(newEvent)
    });

    // Check mass balances and run anomaly checks
    enterpriseMrvService.runRealtimeAnomalies(newEvent);

    enterpriseStore.saveToStorage();
    return newEvent;
  },

  correctMrvEvent: (eventId: string, actor: string, newMeasurement: number, reason: string): MRVEvent => {
    const event = enterpriseStore.mrvEvents.find(e => e.eventId === eventId);
    if (!event) throw new Error('MRV Event not found');

    const previousState = JSON.stringify(event);
    const oldMeasurement = event.measurement;
    event.measurement = newMeasurement;
    event.recordedAt = new Date().toISOString();

    // Log Correction Record
    enterpriseMrvService.logAudit({
      eventType: 'MRV_EVENT_CORRECTION',
      actor,
      organization: 'Local Authority',
      resourceType: 'MRVEvent',
      resourceId: eventId,
      action: `Corrected measurement from ${oldMeasurement} to ${newMeasurement} ${event.unit}`,
      previousStateReference: previousState,
      newStateReference: JSON.stringify(event),
      reason
    });

    enterpriseStore.saveToStorage();
    return event;
  },

  // 2. Chain of Custody (Provenance) Explorer
  getChainOfCustody: (projectId: string): ChainOfCustody => {
    // Generate Custody Graph Dynamically from local MRV Events and related processes
    const events = enterpriseStore.mrvEvents.filter(e => e.projectId === projectId);
    
    const nodes: any[] = [];
    const links: any[] = [];

    if (projectId === 'PRJ_MUNICIPAL_EAST') {
      nodes.push(
        { id: 'SRC_01', label: 'Ward 25 Households', type: 'SOURCE', timestamp: '2026-07-10T08:00:00Z', details: 'Residential source segregation organic waste', location: 'Ward 25 Sector B' },
        { id: 'COLL_01', label: 'Ward 25 Collection', type: 'COLLECTION', timestamp: '2026-07-10T08:30:00Z', details: 'Segregated cart pickup by Manoj', quantity: '2.45 Tonnes' },
        { id: 'TRNS_01', label: 'Truck UP16-7392', type: 'TRANSPORT', timestamp: '2026-07-10T09:00:00Z', details: 'Secondary hauling to composting plant', location: 'In Transit' },
        { id: 'PROC_01', label: 'Composting MRF Facility', type: 'PROCESSING', timestamp: '2026-07-10T09:15:00Z', details: 'Aerobic windrow treatment process', location: 'MRF Yard Alpha', quantity: '2.45 Tonnes Tipped' },
        { id: 'DEST_01', label: 'Compost Soil Fertilizer Product', type: 'FINAL_DESTINATION', timestamp: '2026-07-10T12:00:00Z', details: 'Sold to Regional Farmers Cooperative', location: 'Govt Fertilizer Registry' }
      );

      links.push(
        { fromId: 'SRC_01', toId: 'COLL_01', type: 'TRANSFER' },
        { fromId: 'COLL_01', toId: 'TRNS_01', type: 'TRANSFER' },
        { fromId: 'TRNS_01', toId: 'PROC_01', type: 'TRANSFER' },
        { fromId: 'PROC_01', toId: 'DEST_01', type: 'TRANSFORMATION' }
      );
    } else {
      nodes.push(
        { id: 'SRC_R_01', label: 'Farmer Crop Fields', type: 'SOURCE', timestamp: '2026-07-10T10:00:00Z', details: 'Paddy fields harvest residue', location: 'Ludhiana Village Cluster' },
        { id: 'COLL_R_01', label: 'Fields Stubble Aggregation', type: 'COLLECTION', timestamp: '2026-07-10T11:45:00Z', details: 'Baled residue pickup', quantity: '4.8 Tonnes' },
        { id: 'STOR_R_01', label: 'FPO Storage Center', type: 'AGGREGATION', timestamp: '2026-07-10T12:00:00Z', details: 'Dry stacking storage cell', location: 'Panchayat Village Resource Centre' },
        { id: 'PROC_R_01', label: 'Bio-CNG Production Plant', type: 'PROCESSING', timestamp: '2026-07-11T08:00:00Z', details: 'Methane capture anaerobic bio-reactor', location: 'Ludhiana Central Plant', quantity: '4.8 Tonnes input' }
      );

      links.push(
        { fromId: 'SRC_R_01', toId: 'COLL_R_01', type: 'TRANSFER' },
        { fromId: 'COLL_R_01', toId: 'STOR_R_01', type: 'TRANSFER' },
        { fromId: 'STOR_R_01', toId: 'PROC_R_01', type: 'TRANSFER' }
      );
    }

    return { projectId, nodes, links };
  },

  // 3. Evidence Engine & Completeness Scoring
  getEvidenceRecords: (projectId?: string): EvidenceRecord[] => {
    if (projectId) return enterpriseStore.evidenceRecords.filter(e => e.projectId === projectId);
    return enterpriseStore.evidenceRecords;
  },

  getEvidencePackages: (projectId?: string): EvidencePackage[] => {
    if (projectId) return enterpriseStore.evidencePackages.filter(p => p.projectId === projectId);
    return enterpriseStore.evidencePackages;
  },

  addEvidenceRecord: (record: Omit<EvidenceRecord, 'evidenceId' | 'uploadedAt' | 'integrityHash' | 'checksum'>): EvidenceRecord => {
    const evidenceId = generateId('EVID');
    const uploadedAt = new Date().toISOString();
    const payloadStr = `${evidenceId}:${uploadedAt}:${record.projectId}:${record.fileReference}:${record.evidenceType}`;
    const newRecord: EvidenceRecord = {
      ...record,
      evidenceId,
      uploadedAt,
      checksum: `md5_${hashStringHex(payloadStr).substring(0, 32)}`,
      integrityHash: `sha256_${hashStringHex(payloadStr)}`
    };
    enterpriseStore.evidenceRecords.push(newRecord);

    // Link evidence to existing MRV event if matching
    if (record.eventId) {
      const evt = enterpriseStore.mrvEvents.find(e => e.eventId === record.eventId);
      if (evt && !evt.evidenceRefs.includes(newRecord.evidenceId)) {
        evt.evidenceRefs.push(newRecord.evidenceId);
        evt.dataQuality = evt.evidenceRefs.length * 40 + 15 > 100 ? 100 : evt.evidenceRefs.length * 40 + 15;
      }
    }

    // Auto update or create evidence package
    let pkg = enterpriseStore.evidencePackages.find(p => p.projectId === record.projectId);
    if (!pkg) {
      pkg = {
        packageId: generateId('PKG'),
        projectId: record.projectId,
        name: 'Dynamic Project Evidence Package',
        description: 'Auto-compiled audit package of all uploaded evidence documents',
        evidenceIds: [newRecord.evidenceId],
        completenessScore: 50,
        status: EvidenceStatus.DATA_PRESENT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      enterpriseStore.evidencePackages.push(pkg);
    } else {
      pkg.evidenceIds.push(newRecord.evidenceId);
      pkg.updatedAt = new Date().toISOString();
    }

    // Calculate completeness score based on needed categories (e.g. at least 1 Photo, 1 Document/Receipt)
    const projectEvids = enterpriseStore.evidenceRecords.filter(e => e.projectId === record.projectId);
    const hasPhoto = projectEvids.some(e => e.evidenceType === EvidenceType.PHOTO);
    const hasWeigh = projectEvids.some(e => e.evidenceType === EvidenceType.WEIGHBRIDGE_SLIP);
    let score = 30;
    if (hasPhoto) score += 35;
    if (hasWeigh) score += 35;
    pkg.completenessScore = score;
    pkg.status = score >= 100 ? EvidenceStatus.DATA_COMPLETE : EvidenceStatus.DATA_PRESENT;

    enterpriseMrvService.logAudit({
      eventType: 'EVIDENCE_UPLOAD',
      actor: record.actor,
      organization: 'Local Authority',
      resourceType: 'EvidenceRecord',
      resourceId: newRecord.evidenceId,
      action: `Uploaded ${record.evidenceType} file reference: ${record.fileReference}`
    });

    enterpriseStore.saveToStorage();
    return newRecord;
  },

  // 4. Carbon Intelligence Engine
  getEmissionFactors: (): EmissionFactor[] => {
    return enterpriseStore.emissionFactors;
  },

  getMethodologies: (): Methodology[] => {
    return enterpriseStore.methodologies;
  },

  addEmissionFactor: (factor: Omit<EmissionFactor, 'factorId' | 'version'>): EmissionFactor => {
    const newFactor: EmissionFactor = {
      ...factor,
      factorId: generateId('EF'),
      version: '1.0'
    };
    enterpriseStore.emissionFactors.push(newFactor);
    enterpriseStore.saveToStorage();
    return newFactor;
  },

  calculateCarbonReductions: (projectId: string, mrvEventId: string, methodologyId: string): CalculationRun => {
    const event = enterpriseStore.mrvEvents.find(e => e.eventId === mrvEventId);
    if (!event) throw new Error('MRV Event not found');

    const meth = enterpriseStore.methodologies.find(m => m.methodologyId === methodologyId);
    if (!meth) throw new Error('Methodology not found');

    // Get relevant emission factor
    const isOrganic = event.operatingMode === OperatingMode.URBAN;
    const factorObj = enterpriseStore.emissionFactors.find(ef => 
      isOrganic ? ef.factorId === 'EF_MSW_01' : ef.factorId === 'EF_AGRI_STUBBLE_01'
    ) || enterpriseStore.emissionFactors[0];

    const tonnes = event.measurement / 1000; // Convert kg to tonnes
    const EF = factorObj.value;

    const baselineEmissions = tonnes * EF;
    const projectEmissions = event.operatingMode === OperatingMode.URBAN ? tonnes * 0.12 : tonnes * 0.08;
    const netReductions = Math.max(0, baselineEmissions - projectEmissions);

    const calculationSteps = [
      `1. Convert measurement: ${event.measurement} kg / 1000 = ${tonnes} tonnes`,
      `2. Get active Emission Factor: ${factorObj.name} (${EF} ${factorObj.unit})`,
      `3. Calculate Baseline avoided emissions: ${tonnes} tonnes * ${EF} = ${baselineEmissions.toFixed(3)} tonnes CO2e`,
      `4. Deduct project transport & handling: ${projectEmissions.toFixed(3)} tonnes CO2e`,
      `5. Calculate Net GHG Reductions: ${baselineEmissions.toFixed(3)} - ${projectEmissions.toFixed(3)} = ${netReductions.toFixed(3)} tonnes CO2e avoided`
    ];

    const calculationRun: CalculationRun = {
      calculationRunId: generateId('CALC_RUN'),
      projectId,
      monitoringPeriodId: 'MP_2026_Q1',
      methodologyId,
      methodologyVersion: meth.version,
      equationVersion: 'EQ_02_v1.0',
      inputSnapshot: { wasteWeightKg: event.measurement, operatingMode: event.operatingMode },
      emissionFactorSnapshot: { [factorObj.factorId]: EF },
      parameterSnapshot: { wasteTonnes: tonnes },
      calculationSteps,
      intermediateResults: { baselineEmissions, projectEmissions },
      finalResult: parseFloat(netReductions.toFixed(3)),
      unit: 'tonnes CO2e',
      uncertaintyResult: 5.0, // 5%
      executedAt: new Date().toISOString(),
      engineVersion: 'RupayEngine_v3.0.0',
      calculationHash: `sha256_calc_${hashStringHex(`${runId}:${meth.methodologyId}:${netReductions}`)}`
    };

    enterpriseStore.calculationRuns.push(calculationRun);

    enterpriseMrvService.logAudit({
      eventType: 'CARBON_CALCULATION',
      actor: 'Carbon Intelligence Engine',
      organization: 'RupayKg Engine',
      resourceType: 'CalculationRun',
      resourceId: calculationRun.calculationRunId,
      action: `Executed methodology ${meth.methodologyCode} calculation run resulting in ${netReductions.toFixed(2)} tonnes CO2e avoided`,
      newStateReference: JSON.stringify(calculationRun)
    });

    enterpriseStore.saveToStorage();
    return calculationRun;
  },

  getCalculationRuns: (projectId?: string): CalculationRun[] => {
    if (projectId) return enterpriseStore.calculationRuns.filter(c => c.projectId === projectId);
    return enterpriseStore.calculationRuns;
  },

  // 5. Methodology Digitization Studio Pipeline (AI-Powered)
  digitizeMethodology: async (pdfName: string, textSnippet: string): Promise<Methodology> => {
    const jobId = enterpriseMrvService.launchJob('Methodology Ingestion', 'METHODOLOGY_PARSING');
    
    // Create new methodology placeholder in draft state
    const code = 'METH_' + hashStringHex(pdfName).substring(0, 6).toUpperCase();
    const newMeth: Methodology = {
      methodologyId: generateId('METH'),
      methodologyCode: code,
      title: `Digitized Methodology - ${pdfName.replace('.pdf', '')}`,
      jurisdiction: 'India & CCTS Regulatory Framework',
      program: 'Indian Carbon Credit Trading Scheme (CCTS)',
      sector: 'Solid Waste & Biomass Systems',
      activityType: 'Automated Processing',
      version: '1.0',
      effectiveDate: new Date().toISOString().split('T')[0],
      status: MethodologyStatus.PARSED,
      sourceDocument: pdfName,
      sourceAuthority: 'Ministry of Power / BEE India',
      methodologyHash: `sha256_${hashStringHex(textSnippet || pdfName)}`,
      digitizationStatus: 'Extracted via AI Parser',
      policyCompilationStatus: 'Awaiting Compilation',
      calculationCoverage: 80,
      evidenceCoverage: 75,
      testCoverage: 0,
      reviewStatus: 'Under Ingest Review',
      ir: {
        metadata: {
          methodologyId: 'METH_TEMP',
          methodologyCode: code,
          title: `Digitized Methodology - ${pdfName.replace('.pdf', '')}`,
          jurisdiction: 'India CCTS',
          program: 'CCTS',
          sector: 'Circular Economy',
          version: '1.0',
          effectiveDate: new Date().toISOString().split('T')[0]
        },
        applicability: ['Applicable to general Indian circular economy projects', 'Requires verified activity records'],
        roles: ['Project Developer', 'Verifier', 'Collector'],
        entities: ['Facility', 'Weighbridge'],
        parameters: [
          { code: 'Q_waste', name: 'Material flow weight', unit: 'tonnes', valueType: 'NUMBER', source: 'Weighbridge' },
          { code: 'EF_baseline', name: 'Avoided burning factor', unit: 'kg/kg', valueType: 'NUMBER', defaultValue: 0.8, source: 'Emission Registry' }
        ],
        equations: [
          { equationId: 'EQ_1', code: 'Baseline_Emissions', expression: 'Q_waste * EF_baseline', description: 'Emissions in baseline scenario', parameters: ['Q_waste', 'EF_baseline'] },
          { equationId: 'EQ_2', code: 'Net_Credits', expression: 'Baseline_Emissions * 0.95', description: 'Net avoided credits accounting for uncertainty leakage', parameters: ['Baseline_Emissions'] }
        ],
        dependencies: [{ target: 'EQ_2', sources: ['EQ_1'] }],
        emissionFactors: ['EF_MSW_01'],
        monitoringRules: ['Monthly reports with signed weighbridge slips', 'Quarterly site boundary spatial validation'],
        evidenceRules: ['Weighbridge slip signed copy upload', 'GPS capture of aggregating asset'],
        eligibilityRules: ['The baseline burning of agricultural waste must be the common local practice', 'No prior carbon credits claimed on the same coordinates'],
        calculationRules: ['Calculations must apply CCTS compliance rules'],
        verificationRules: ['Annual validation visit by BEE designated verifier', 'Traceability of individual farmer payout statements'],
        workflow: ['Draft', 'FPO Verified', 'Active'],
        issuanceConditions: ['Data verification completeness is certified'],
        reportingRequirements: ['CCTS reporting templates compiled'],
        references: ['National guidelines on CCTS article 16'],
        version: '1.0'
      }
    };

    enterpriseStore.methodologies.unshift(newMeth);
    enterpriseStore.saveToStorage();

    // Fast-simulate job execution
    setTimeout(() => {
      enterpriseMrvService.updateJob(jobId, 100, JobStatus.COMPLETED, [
        { stepId: '1', name: 'OCR Ingestion', status: JobStatus.COMPLETED, log: 'PDF text read successfully' },
        { stepId: '2', name: 'AI Parameter Extraction', status: JobStatus.COMPLETED, log: 'Extracted baseline parameters & equations' },
        { stepId: '3', name: 'Methodology IR Compilation', status: JobStatus.COMPLETED, log: 'Generated structured Intermediate Representation JSON' }
      ], [
        { name: 'Structured Methodology IR', ref: `/api/methodology-studio/${newMeth.methodologyId}/ir` }
      ]);
    }, 2000);

    return newMeth;
  },

  // 6. Policy Execution Fabric & Hedera Guardian Adapters
  getPolicies: (): Policy[] => {
    return enterpriseStore.policies;
  },

  compileAndDeployPolicy: (methodologyId: string): Policy => {
    const meth = enterpriseStore.methodologies.find(m => m.methodologyId === methodologyId);
    if (!meth) throw new Error('Methodology not found');

    const newPolicy: Policy = {
      policyId: generateId('POL'),
      name: `${meth.methodologyCode} - Guardian Policy representation`,
      version: meth.version,
      status: 'Active',
      compiledAt: new Date().toISOString(),
      deployedAt: new Date().toISOString(),
      hederaTopicId: process.env.HEDERA_TOPIC_ID || '',
      schemaMappingsCount: meth.ir?.entities.length || 2,
      roleMappingsCount: meth.ir?.roles.length || 2
    };

    enterpriseStore.policies.unshift(newPolicy);

    // Update methodology
    meth.policyCompilationStatus = 'Compiled & Deployed to Hedera Guardian';
    meth.status = MethodologyStatus.ACTIVE;

    // Log deployment audit
    enterpriseMrvService.logAudit({
      eventType: 'POLICY_DEPLOYMENT',
      actor: 'Policy Engine Compiler',
      organization: 'Hedera Guardian Adapter',
      resourceType: 'Policy',
      resourceId: newPolicy.policyId,
      action: `Compiled Methodology IR and deployed smart policy representation to Hedera Topic ${newPolicy.hederaTopicId}`
    });

    enterpriseStore.saveToStorage();
    return newPolicy;
  },

  getRoleMappings: (): RoleMapping[] => {
    return enterpriseStore.roleMappings;
  },

  getSchemaMappings: (): SchemaMapping[] => {
    return enterpriseStore.schemaMappings;
  },

  addRoleMapping: (mapping: RoleMapping): RoleMapping => {
    enterpriseStore.roleMappings.push(mapping);
    enterpriseStore.saveToStorage();
    return mapping;
  },

  addSchemaMapping: (mapping: SchemaMapping): SchemaMapping => {
    enterpriseStore.schemaMappings.push(mapping);
    enterpriseStore.saveToStorage();
    return mapping;
  },

  // 7. Verification Workspace
  getEngagements: (): VerificationEngagement[] => {
    return enterpriseStore.engagements;
  },

  getFindings: (engagementId?: string): VerificationFinding[] => {
    if (engagementId) return enterpriseStore.findings.filter(f => f.engagementId === engagementId);
    return enterpriseStore.findings;
  },

  addVerificationFinding: (finding: Omit<VerificationFinding, 'findingId' | 'reportedAt' | 'history'>): VerificationFinding => {
    const newFinding: VerificationFinding = {
      ...finding,
      findingId: generateId('FND'),
      reportedAt: new Date().toISOString(),
      history: [
        { timestamp: new Date().toISOString(), actor: finding.reportedBy, action: 'Reported', comment: finding.description }
      ]
    };
    enterpriseStore.findings.unshift(newFinding);

    enterpriseMrvService.logAudit({
      eventType: 'VERIFICATION_FINDING_CREATED',
      actor: finding.reportedBy,
      organization: 'Verifier',
      resourceType: 'VerificationFinding',
      resourceId: newFinding.findingId,
      action: `Created verification finding: "${finding.title}"`
    });

    enterpriseStore.saveToStorage();
    return newFinding;
  },

  resolveFinding: (findingId: string, actor: string, comment: string): VerificationFinding => {
    const finding = enterpriseStore.findings.find(f => f.findingId === findingId);
    if (!finding) throw new Error('Finding not found');

    finding.status = FindingStatus.CLOSED;
    finding.resolvedAt = new Date().toISOString();
    finding.resolvedBy = actor;
    finding.history.push({
      timestamp: new Date().toISOString(),
      actor,
      action: 'Closed',
      comment
    });

    enterpriseMrvService.logAudit({
      eventType: 'VERIFICATION_FINDING_CLOSED',
      actor,
      organization: 'Verifier',
      resourceType: 'VerificationFinding',
      resourceId: findingId,
      action: `Resolved and Closed verification finding: "${finding.title}"`
    });

    enterpriseStore.saveToStorage();
    return finding;
  },

  signOffEngagement: (engagementId: string, verifierName: string, statement: string): VerificationEngagement => {
    const engagement = enterpriseStore.engagements.find(e => e.engagementId === engagementId);
    if (!engagement) throw new Error('Engagement not found');

    engagement.status = 'COMPLETED';
    engagement.endDate = new Date().toISOString().split('T')[0];
    engagement.verificationStatement = statement;
    engagement.digitalSignOffBy = verifierName;
    engagement.digitalSignOffAt = new Date().toISOString();

    // Trigger update on verified items
    enterpriseStore.mrvEvents.forEach(e => {
      if (e.projectId === engagement.projectId) {
        e.verificationStatus = VerificationStatus.VERIFIED;
      }
    });

    enterpriseMrvService.logAudit({
      eventType: 'VERIFICATION_SIGNOFF',
      actor: verifierName,
      organization: 'Verifier Organization',
      resourceType: 'VerificationEngagement',
      resourceId: engagementId,
      action: `Digitally signed verification engagement statement for monitoring period Q1 2026`
    });

    enterpriseStore.saveToStorage();
    return engagement;
  },

  // 8. Registry Gateway & Indian CCTS Readiness Layer
  getAssessments: (projectId?: string): CCTSReadinessAssessment[] => {
    if (projectId) return enterpriseStore.assessments.filter(a => a.projectId === projectId);
    return enterpriseStore.assessments;
  },

  runCCTSReadinessAssessment: (projectId: string, actor: string): CCTSReadinessAssessment => {
    const projectEvids = enterpriseStore.evidenceRecords.filter(e => e.projectId === projectId);
    const mrvEvts = enterpriseStore.mrvEvents.filter(e => e.projectId === projectId);
    
    // Check checklist metrics
    const hasPhotos = projectEvids.some(e => e.evidenceType === EvidenceType.PHOTO);
    const hasReceipts = projectEvids.some(e => e.evidenceType === EvidenceType.WEIGHBRIDGE_SLIP || e.evidenceType === EvidenceType.INVOICE);
    const hasLocation = mrvEvts.some(e => e.latitude > 0);
    const activeFindings = enterpriseStore.findings.filter(f => f.status === FindingStatus.OPEN);

    const requirementResults = [
      {
        requirementId: 'REQ_OWNER_01',
        category: 'Project Information',
        title: 'Project Ownership Verification',
        description: 'Authorized local corporate entity registration and land/facility deed matches boundary coordinates.',
        status: 'MET' as const,
        evidenceLinked: true,
        calculationsVerified: true,
        remarks: 'Panchayat authorization and corporate ROC verified.'
      },
      {
        requirementId: 'REQ_METH_02',
        category: 'Methodology Mapping',
        title: 'Approved Methodology Alignment',
        description: 'Requires projects to align and map exactly with an active digitized UNFCCC/CCTS methodology representation.',
        status: 'MET' as const,
        evidenceLinked: true,
        calculationsVerified: true,
        remarks: 'Successfully aligned with digitized ACM0022/AMS-III.E rules.'
      },
      {
        requirementId: 'REQ_EVID_03',
        category: 'Evidence Completeness',
        title: 'Primary MRV Activity Proof Package',
        description: 'Requires verified weighbridge records, tipping receipts, and continuous photographic timestamped telemetry.',
        status: hasPhotos && hasReceipts ? 'MET' as const : 'PARTIALLY_MET' as const,
        evidenceLinked: hasPhotos || hasReceipts,
        calculationsVerified: false,
        remarks: hasPhotos && hasReceipts ? 'Photo evidence and weighbridge slips fully captured.' : 'Partial documentation packages found. Lacking signed weighbridge slip file.'
      },
      {
        requirementId: 'REQ_VERIFY_04',
        category: 'Verification Status',
        title: 'Third-Party Verification Statement',
        description: 'Independent audit signed declaration package and resolved audit findings register.',
        status: activeFindings.length === 0 ? 'MET' as const : 'NOT_MET' as const,
        evidenceLinked: false,
        calculationsVerified: true,
        remarks: activeFindings.length === 0 ? 'All findings cleared. Verifier signed audit declaration.' : `Currently blocked by ${activeFindings.length} open verification findings.`
      }
    ];

    const metCount = requirementResults.filter(r => r.status === 'MET').length;
    const overallScore = Math.floor((metCount / requirementResults.length) * 100);

    let status = CCTSReadinessStatus.DATA_GAPS;
    if (overallScore >= 100) status = CCTSReadinessStatus.READY;
    else if (overallScore >= 75) status = CCTSReadinessStatus.CONDITIONALLY_READY;
    else if (activeFindings.length > 0) status = CCTSReadinessStatus.VERIFICATION_REQUIRED;

    const assessment: CCTSReadinessAssessment = {
      assessmentId: generateId('ASM'),
      projectId,
      assessedAt: new Date().toISOString(),
      assessedBy: actor,
      status,
      overallScore,
      requirementResults
    };

    enterpriseStore.assessments.unshift(assessment);
    enterpriseStore.saveToStorage();
    return assessment;
  },

  // 9. Mass Balance & Data Quality Engines
  getMassBalances: (): MassBalanceRecord[] => {
    return enterpriseStore.massBalances;
  },

  triggerMassBalanceCheck: (facilityId: string, materialType: string, inputs: number, outputs: number, losses: number): MassBalanceRecord => {
    const openingStock = 10.0;
    const closingStock = (openingStock + inputs) - (outputs + losses);
    const observedBalance = closingStock; // perfect physical trace in model
    const expectedBalance = openingStock + inputs - outputs - losses;
    const variance = observedBalance - expectedBalance;
    const variancePercentage = expectedBalance > 0 ? (variance / expectedBalance) * 100 : 0;

    const alerts: string[] = [];
    let status: 'BALANCED' | 'INVESTIGATION_REQUIRED' = 'BALANCED';

    if (variancePercentage > 5 || variancePercentage < -5) {
      alerts.push('UNEXPLAINED_MASS_GAIN_LOSS_VARIANCE');
      status = 'INVESTIGATION_REQUIRED';

      // Auto trigger AI anomaly alert
      enterpriseStore.alerts.unshift({
        alertId: generateId('AL'),
        alertType: 'MASS_BALANCE_DISCREPANCY',
        severity: 'HIGH',
        affectedRecords: [facilityId],
        reason: `Material balance variance exceeds critical 5% threshold with ${variancePercentage.toFixed(2)}% discrepancy.`,
        supportingSignals: [`Inputs: ${inputs} tonnes`, `Outputs: ${outputs} tonnes`, `Variance: ${variance.toFixed(2)} tonnes`],
        modelReference: 'MassBalanceEngine_v3',
        modelVersion: '1.0.0',
        createdAt: new Date().toISOString(),
        reviewStatus: 'PENDING'
      });
    }

    const newMB: MassBalanceRecord = {
      recordId: generateId('MB'),
      facilityId,
      materialType,
      monitoringPeriodId: 'MP_2026_Q1',
      openingStock,
      inputs,
      outputs,
      transformations: inputs * 0.15,
      losses,
      rejections: 1.2,
      closingStock,
      expectedBalance,
      observedBalance,
      variance,
      variancePercentage,
      status,
      alerts
    };

    enterpriseStore.massBalances.unshift(newMB);
    enterpriseStore.saveToStorage();
    return newMB;
  },

  getAnomalyAlerts: (): AnomalyAlert[] => {
    return enterpriseStore.alerts;
  },

  runRealtimeAnomalies: (event: MRVEvent) => {
    // Deterministic Rule checks
    // 1. Double spending check
    const isDuplicate = enterpriseStore.mrvEvents.some(e => e.eventId !== event.eventId && e.measurement === event.measurement && e.timestamp === event.timestamp);
    if (isDuplicate) {
      enterpriseStore.alerts.unshift({
        alertId: generateId('AL'),
        alertType: 'BATCH_DUPLICATION_ATTEMPT',
        severity: 'CRITICAL',
        affectedRecords: [event.eventId],
        reason: `Duplicate material measurement detected. Exactly ${event.measurement} ${event.unit} was logged previously at the same timestamp.`,
        supportingSignals: ['Identical weight value', 'Overlapping timestamp logs'],
        modelReference: 'DeterministicIntegrityFilter',
        modelVersion: '2.0.0',
        createdAt: new Date().toISOString(),
        reviewStatus: 'PENDING'
      });
    }

    // 2. Location checks
    if (event.latitude === 0 || event.longitude === 0) {
      enterpriseStore.alerts.unshift({
        alertId: generateId('AL'),
        alertType: 'MISSING_GPS_EVIDENCE',
        severity: 'HIGH',
        affectedRecords: [event.eventId],
        reason: 'Canonical MRV activity event logged without geo-coordinates trace metadata.',
        supportingSignals: ['Zeroed latitude/longitude'],
        modelReference: 'DeterministicIntegrityFilter',
        modelVersion: '2.0.0',
        createdAt: new Date().toISOString(),
        reviewStatus: 'PENDING'
      });
    }
  },

  reviewAnomaly: (alertId: string, decision: 'FALSE_POSITIVE' | 'CONFIRMED', comments: string): AnomalyAlert => {
    const alert = enterpriseStore.alerts.find(a => a.alertId === alertId);
    if (!alert) throw new Error('Alert not found');

    alert.reviewStatus = decision;
    alert.reviewDecision = comments;

    enterpriseStore.saveToStorage();
    return alert;
  },

  // 10. Platform Audit Logs
  getAuditEvents: (): AuditEvent[] => {
    return enterpriseStore.auditEvents;
  },

  logAudit: (event: Omit<AuditEvent, 'auditEventId' | 'timestamp' | 'requestId' | 'correlationId' | 'integrityHash'>): AuditEvent => {
    const auditEventId = generateId('AUD');
    const timestamp = new Date().toISOString();
    const payloadStr = `${auditEventId}:${timestamp}:${event.eventType}:${event.resourceId}:${event.action}`;
    const newEvent: AuditEvent = {
      ...event,
      auditEventId,
      timestamp,
      requestId: `req_${hashStringHex(payloadStr).substring(0, 10)}`,
      correlationId: `corr_${hashStringHex(payloadStr).substring(10, 20)}`,
      integrityHash: `sha256_${hashStringHex(payloadStr)}`
    };
    enterpriseStore.auditEvents.unshift(newEvent);
    enterpriseStore.saveToStorage();
    return newEvent;
  },

  // 11. Integration Registry & Job System
  getIntegrations: (): IntegrationCapability[] => {
    return enterpriseStore.integrations;
  },

  getJobs: (): Job[] => {
    return enterpriseStore.jobs;
  },

  launchJob: (name: string, type: string): string => {
    const jobId = generateId('JOB');
    const newJob: Job = {
      jobId,
      name,
      type,
      status: JobStatus.RUNNING,
      progress: 10,
      startedAt: new Date().toISOString(),
      actor: 'System Integration Hub',
      steps: [
        { stepId: '1', name: 'Trigger Request', status: JobStatus.RUNNING }
      ],
      artifacts: []
    };
    enterpriseStore.jobs.unshift(newJob);
    enterpriseStore.saveToStorage();
    return jobId;
  },

  updateJob: (jobId: string, progress: number, status: JobStatus, steps: any[], artifacts?: any[]) => {
    const job = enterpriseStore.jobs.find(j => j.jobId === jobId);
    if (job) {
      job.progress = progress;
      job.status = status;
      job.steps = steps;
      if (artifacts) job.artifacts = artifacts;
      if (status === JobStatus.COMPLETED) job.completedAt = new Date().toISOString();
      enterpriseStore.saveToStorage();
    }
  }
};
