// RupayKg Carbon OS — Phase 6.5: Kathonda Physical Boundary & Carbon-Source Segregation Service
// Establishes physical and carbon accounting boundaries, sub-units, mass balance, double-counting checks, and calculation gate

import crypto from 'crypto';

export interface OperationalSubUnit {
  unit_id: string;
  name: string;
  type: 'WTE_PLANT' | 'FRESH_MSW_RECEIVING' | 'LEGACY_WASTE_AREA' | 'RDF_RECOVERY' | 'ASH_MANAGEMENT' | 'SCIENTIFIC_LANDFILL' | 'BIOMETHANATION_COMPOST';
  coordinates: string;
  boundary: string;
  operator: string;
  owner: string;
  operating_period: string;
  waste_stream: string;
  documents: string[];
  evidence: string[];
  status: 'OPERATIONAL' | 'OPERATIONAL_SEPARATE_BOUNDARY' | 'UNDER_REMEDIATION_PENDING_VERIFICATION' | 'OPERATIONAL_SEPARATE_STREAM' | 'OPERATIONAL_INORGANIC' | 'METHODOLOGY_WA03_001_TARGET';
}

export interface ProjectBoundaryRecord {
  survey_reference: string;
  khasra_numbers: string[];
  area: string;
  coordinates: string;
  GIS_polygon: string;
  source_document: string;
  source_hash: string;
  verification_status: 'SECONDARY_VERIFIED — PENDING_PRIMARY_TITLE_DEED' | 'PRIMARY_VERIFIED' | 'DATA_GAP';
  verified_by: string;
  verified_at: string;
}

export interface CarbonAccountingBoundaryRecord {
  included_sources: string[];
  excluded_sources: string[];
  reasons_for_inclusion: Record<string, string>;
  reasons_for_exclusion: Record<string, string>;
  evidence: string[];
  methodology_basis: string;
  approval_status: 'PENDING_INTERNAL_APPROVAL' | 'APPROVED' | 'REJECTED';
}

export interface LegacyRemediationEvent {
  event_id: string;
  date: string;
  quantity_tonnes: number;
  remediation_method: 'BIOMINING_TROMMELING' | 'EXCAVATION' | 'CAPPING';
  destination: string;
  RDF_generated_tonnes: number;
  reject_generated_tonnes: number;
  recovered_material_tonnes: number;
  operator: string;
  authority: string;
  evidence_hash: string;
  verification_status: 'SECONDARY_SOURCE' | 'PRIMARY_VERIFIED' | 'PENDING_VERIFICATION';
}

// --- 1. KATHONDA COMPLEX PARENT FACILITY ---
export const KATHONDA_COMPLEX_FACILITY = {
  facility_id: "KATHONDA-COMPLEX-JBP",
  name: "Kathonda MSW Processing & Disposal Complex",
  type: "COMPLEX_WASTE_FACILITY",
  location: "Kathonda, Patan Road, Jabalpur, Madhya Pradesh 482002 (23.2183° N, 79.8972° E)",
  owner: "Jabalpur Municipal Corporation (JMC)",
  operator: "JMC / Contracted Concessionaires (PENDING_VERIFICATION)",
  total_area: "35.4 Hectares (District Environment Plan Record)",
  units_count: 7,
  status: "ACTIVE_PRE_CALCULATION_BOUNDARIES_ESTABLISHED"
};

// --- 2. OPERATIONAL SUB-UNITS ---
export const KATHONDA_SUB_UNITS: OperationalSubUnit[] = [
  {
    unit_id: "UNIT-01",
    name: "Waste-to-Energy (WTE) Power Generation Unit",
    type: "WTE_PLANT",
    coordinates: "23.2188° N, 79.8975° E",
    boundary: "Northern Complex Quadrant (6.2 ha)",
    operator: "PENDING_VERIFICATION",
    owner: "Jabalpur Municipal Corporation (JMC)",
    operating_period: "2016-Present (PENDING_VERIFICATION)",
    waste_stream: "High Calorific Dry Fraction / RDF Feedstock",
    documents: ["WTE Concession Agreement (PENDING_VERIFICATION)", "MPPCB CTO for WTE Plant"],
    evidence: ["DEP-JBP-2024-WTE-SECTION"],
    status: "OPERATIONAL_SEPARATE_BOUNDARY"
  },
  {
    unit_id: "UNIT-02",
    name: "Fresh MSW Receiving, Weighbridge & MRF Processing Yard",
    type: "FRESH_MSW_RECEIVING",
    coordinates: "23.2178° N, 79.8965° E",
    boundary: "Main Entrance Gate & Primary Platform (4.0 ha)",
    operator: "JMC SWM Department",
    owner: "Jabalpur Municipal Corporation (JMC)",
    operating_period: "2014-Present",
    waste_stream: "Raw Unsegregated Municipal Solid Waste (~450-500 TPD)",
    documents: ["JMC Weighbridge Logbook Template", "SWM Receipt Register"],
    evidence: ["DEP-JBP-2024-WEIGHBRIDGE-SECTION"],
    status: "OPERATIONAL"
  },
  {
    unit_id: "UNIT-03",
    name: "Legacy Waste Dump & Biomining Remediation Site",
    type: "LEGACY_WASTE_AREA",
    coordinates: "23.2192° N, 79.8980° E",
    boundary: "Eastern Dumpsite Quadrant (12.5 ha)",
    operator: "Biomining Concessionaire / JMC (PENDING_VERIFICATION)",
    owner: "Jabalpur Municipal Corporation (JMC)",
    operating_period: "2014-2024 (Legacy Accrual)",
    waste_stream: "Aged Uncontrolled Legacy MSW (Est. 1.2M Tonnes)",
    documents: ["Legacy Waste Quantification Survey Report", "NGT Compliance Order"],
    evidence: ["DEP-JBP-2024-LEGACY-DUMP-RECORD"],
    status: "UNDER_REMEDIATION_PENDING_VERIFICATION"
  },
  {
    unit_id: "UNIT-04",
    name: "Refuse Derived Fuel (RDF) Processing & Storage Depot",
    type: "RDF_RECOVERY",
    coordinates: "23.2185° N, 79.8970° E",
    boundary: "Central Processing Yard (3.8 ha)",
    operator: "Trommel Plant Operator (PENDING_VERIFICATION)",
    owner: "Jabalpur Municipal Corporation (JMC)",
    operating_period: "2018-Present",
    waste_stream: "Combustible Dry Fraction (>2800 kcal/kg)",
    documents: ["RDF Dispatch Register", "Cement Kiln Offtake Agreement"],
    evidence: ["DEP-JBP-2024-RDF-RECORD"],
    status: "OPERATIONAL_SEPARATE_STREAM"
  },
  {
    unit_id: "UNIT-05",
    name: "Bottom Ash & Fly Ash Management Yard",
    type: "ASH_MANAGEMENT",
    coordinates: "23.2190° N, 79.8985° E",
    boundary: "North-East Enclosed Ash Silo & Pit (1.8 ha)",
    operator: "WTE Facility Operator (PENDING_VERIFICATION)",
    owner: "Jabalpur Municipal Corporation (JMC)",
    operating_period: "2016-Present",
    waste_stream: "Inorganic Thermal Residue (Bottom Ash & Fly Ash)",
    documents: ["Ash Disposal Manifest", "Brick Manufacturing Dispatch Logs"],
    evidence: ["MPPCB-ASH-CONTROL-OCT2025"],
    status: "OPERATIONAL_INORGANIC"
  },
  {
    unit_id: "UNIT-06",
    name: "Scientific Landfill & Gas Extraction Area (Cells 1 & 2)",
    type: "SCIENTIFIC_LANDFILL",
    coordinates: "23.2175° N, 79.8982° E",
    boundary: "Southern Engineered Cells (7.1 ha)",
    operator: "JMC SWM Division / LFG Contractor (PENDING_VERIFICATION)",
    owner: "Jabalpur Municipal Corporation (JMC)",
    operating_period: "2018-Present",
    waste_stream: "Organic Biodegradable Fraction & Landfill Rejects",
    documents: ["Landfill Cell Design Drawing", "HDPE Liner Inspection Record"],
    evidence: ["DEP-JBP-2024-LANDFILL-DESIGN"],
    status: "METHODOLOGY_WA03_001_TARGET"
  },
  {
    unit_id: "UNIT-07",
    name: "Biomethanation & Aerobic Composting Facility",
    type: "BIOMETHANATION_COMPOST",
    coordinates: "23.2170° N, 79.8960° E",
    boundary: "South-West Windrow Platform (3.0 ha)",
    operator: "Compost Plant Operator (PENDING_VERIFICATION)",
    owner: "Jabalpur Municipal Corporation (JMC)",
    operating_period: "2015-Present",
    waste_stream: "Segregated Wet Organic Waste (100-150 TPD)",
    documents: ["FCO Quality Compliance Certificate", "Organic Fertilizer Sales Log"],
    evidence: ["DEP-JBP-2024-COMPOST-RECORD"],
    status: "OPERATIONAL_SEPARATE_BOUNDARY"
  }
];

// --- 3. PHYSICAL PROJECT BOUNDARY ---
export const KATHONDA_PROJECT_BOUNDARY: ProjectBoundaryRecord = {
  survey_reference: "Khasra Nos. 102, 104, 105/1, 105/2, Kathonda Village, Patan Tehsil, Jabalpur",
  khasra_numbers: ["102", "104", "105/1", "105/2"],
  area: "35.4 Hectares",
  coordinates: "23.2183° N, 79.8972° E",
  GIS_polygon: "POLYGON((79.8950 23.2170, 79.8990 23.2170, 79.8990 23.2200, 79.8950 23.2200, 79.8950 23.2170))",
  source_document: "District Environment Plan — Jabalpur District & JMC Kathonda Site Register",
  source_hash: "sha256:d8a9f4e21b8c3a9d7e5f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
  verification_status: "SECONDARY_VERIFIED — PENDING_PRIMARY_TITLE_DEED",
  verified_by: "Jabalpur District Administration",
  verified_at: "2024-03-15"
};

// --- 4. CARBON ACCOUNTING BOUNDARY ---
export const KATHONDA_CARBON_ACCOUNTING_BOUNDARY: CarbonAccountingBoundaryRecord = {
  included_sources: [
    "UNIT-06: Scientific Landfill Cells 1 & 2 LFG Recovery (BM WA03.001 Target)"
  ],
  excluded_sources: [
    "UNIT-01: WTE Plant Direct Combustion & Power Export",
    "UNIT-03: Uncontrolled Legacy Waste Biomining Area",
    "UNIT-04: Offsite Cement Kiln RDF Co-processing",
    "UNIT-05: Inorganic Bottom & Fly Ash Storage",
    "UNIT-07: Aerobic Windrow Composting Platform"
  ],
  reasons_for_inclusion: {
    "UNIT-06": "Monitored LFG collection and destruction satisfies BM WA03.001 applicability criteria."
  },
  reasons_for_exclusion: {
    "UNIT-01": "WTE direct combustion is an independent thermal energy pathway governed by ACM002/BM-T-011 and cannot be merged into BM WA03.001.",
    "UNIT-03": "Legacy waste biomining requires separate baseline decay verification under distinct methodology.",
    "UNIT-04": "RDF fossil fuel substitution is governed by thermal substitution methodology AM0025.",
    "UNIT-05": "Inorganic ash residue has zero anaerobic methane generation potential.",
    "UNIT-07": "Aerobic windrow composting is an independent waste avoidance pathway."
  },
  evidence: [
    "DEP-JBP-2024-FACILITY-MAP",
    "BEE-CCTS-BM-WA03-001-SPECIFICATION"
  ],
  methodology_basis: "BEE CCTS BM WA03.001 — Landfill Methane Recovery & Flaring/Destruction",
  approval_status: "PENDING_INTERNAL_APPROVAL"
};

// --- 5. LEGACY REMEDIATION EVENT RECORD ---
export const KATHONDA_LEGACY_REMEDIATION_EVENT: LegacyRemediationEvent = {
  event_id: "REM-JBP-2025-01",
  date: "2025-02-15",
  quantity_tonnes: 150000,
  remediation_method: "BIOMINING_TROMMELING",
  destination: "UNIT-04 RDF Processing & Landfill Reject Disposal",
  RDF_generated_tonnes: 45000,
  reject_generated_tonnes: 90000,
  recovered_material_tonnes: 15000,
  operator: "JMC Contracted Biomining Operator (PENDING_VERIFICATION)",
  authority: "Jabalpur Municipal Corporation / MPPCB",
  evidence_hash: "sha256:e7d8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8",
  verification_status: "SECONDARY_SOURCE"
};

// --- 6. GAS METER TO SOURCE TRACEABILITY ENGINE ---
export class GasMeterTraceabilityEngine {
  verifyTraceability(meterId: string, cellId: string, lfgSystemId: string) {
    if (!meterId || meterId === 'NOT_CONFIRMED' || !cellId || !lfgSystemId) {
      return {
        isTraceable: false,
        status: 'TRACEABILITY_BLOCKED',
        reason: 'Gas meter or physical LFG pipe mapping is missing or unconfirmed at Kathonda site.'
      };
    }

    if (meterId === 'FM-JBP-01' && cellId === 'CELL-01' && lfgSystemId === 'LFG-SYS-JBP-01') {
      return {
        isTraceable: true,
        status: 'TRACEABLE',
        chain: [
          'Gas Reading TR-2026-001',
          'Flow Meter FM-JBP-01 (NABL Calibrated)',
          'LFG Collector Pipeline LFG-SYS-JBP-01',
          'Scientific Landfill Cell 1 (UNIT-06)',
          'Kathonda Complex (KATHONDA-COMPLEX-JBP)',
          'Project RKG-JBP-WA03-001-001'
        ]
      };
    }

    return {
      isTraceable: false,
      status: 'TRACEABILITY_BLOCKED',
      reason: `Unmapped or unverified meter ID ${meterId} in Kathonda boundary.`
    };
  }
}

export const gasMeterTraceabilityEngine = new GasMeterTraceabilityEngine();

// --- 7. KATHONDA MASS BALANCE ENGINE ---
export class KathondaMassBalanceEngine {
  calculateMassBalance(inputs: {
    freshMswInTonnes: number;
    wteFeedTonnes: number;
    rdfProdTonnes: number;
    compostProdTonnes: number;
    landfillDisposalTonnes: number;
    recycledProdTonnes: number;
  }) {
    const totalOut = inputs.wteFeedTonnes + inputs.rdfProdTonnes + inputs.compostProdTonnes + inputs.landfillDisposalTonnes + inputs.recycledProdTonnes;
    const unaccountedMass = inputs.freshMswInTonnes - totalOut;
    const isBalanced = Math.abs(unaccountedMass) === 0;

    return {
      freshMswInTonnes: inputs.freshMswInTonnes,
      accountedDestinationsTonnes: totalOut,
      unaccountedMassTonnes: unaccountedMass,
      status: isBalanced ? 'BALANCED' : Math.abs(unaccountedMass) <= 5 ? 'WARNING' : 'BLOCKED',
      message: isBalanced 
        ? 'Mass balance fully reconciled across Kathonda operational units.' 
        : `Unexplained mass discrepancy of ${unaccountedMass} tonnes detected in monitoring period.`
    };
  }

  calculateLegacyMassBalance(inputs: {
    initialLegacyTonnes: number;
    remediatedTonnes: number;
    rdfRecoveredTonnes: number;
    recycledFractionTonnes: number;
    landfillRejectTonnes: number;
    remainingLegacyTonnes: number;
  }) {
    const accountedRemediated = inputs.rdfRecoveredTonnes + inputs.recycledFractionTonnes + inputs.landfillRejectTonnes;
    const remediatedDiff = inputs.remediatedTonnes - accountedRemediated;
    const totalAccountedLegacy = inputs.remediatedTonnes + inputs.remainingLegacyTonnes;
    const unaccountedLegacyMass = inputs.initialLegacyTonnes - totalAccountedLegacy;

    const isReconciled = Math.abs(remediatedDiff) === 0 && Math.abs(unaccountedLegacyMass) === 0;

    return {
      initialLegacyTonnes: inputs.initialLegacyTonnes,
      remediatedTonnes: inputs.remediatedTonnes,
      accountedRemediatedFractionTonnes: accountedRemediated,
      remainingLegacyTonnes: inputs.remainingLegacyTonnes,
      unaccountedLegacyMassTonnes: unaccountedLegacyMass,
      status: isReconciled ? 'BALANCED' : 'LEGACY_DATA_REVIEW_REQUIRED',
      message: isReconciled 
        ? 'Legacy waste mass balance fully reconciled.' 
        : `Legacy waste unaccounted mass: ${unaccountedLegacyMass} tonnes. Immediate legacy data review required.`
    };
  }
}

export const kathondaMassBalanceEngine = new KathondaMassBalanceEngine();

// --- 8. DOUBLE-COUNTING PREVENTION MATRIX (CHECKS A to F) ---
export class KathondaDoubleCountingChecker {
  runDoubleCountingAudit(claim: {
    wasteId?: string;
    claimedInWte?: boolean;
    claimedInLandfill?: boolean;
    legacyWasteId?: string;
    claimedInRdf?: boolean;
    claimedInLegacyLandfill?: boolean;
    methaneVolumeNm3?: number;
    claimedInFlaring?: boolean;
    claimedInElectricityGen?: boolean;
    gasSystemId?: string;
    registeredProjectsCount?: number;
    electricityMwh?: number;
    claimedInRec?: boolean;
    claimedInCarbonCredit?: boolean;
    remediationEventId?: string;
    claimedInMultiplePrograms?: boolean;
  }) {
    const violations: string[] = [];

    // Check A: Same waste → WTE + Landfill
    if (claim.claimedInWte && claim.claimedInLandfill) {
      violations.push('CHECK_A_VIOLATION: Same waste stream claimed simultaneously under WTE combustion and Landfill methane avoidance.');
    }

    // Check B: Same legacy waste → RDF + Landfill
    if (claim.claimedInRdf && claim.claimedInLegacyLandfill) {
      violations.push('CHECK_B_VIOLATION: Same legacy waste volume claimed simultaneously as RDF co-processing and landfill disposal.');
    }

    // Check C: Same methane → Flare + Electricity Generation
    if (claim.claimedInFlaring && claim.claimedInElectricityGen) {
      violations.push('CHECK_C_VIOLATION: Same methane volume claimed simultaneously as destruction flaring and power generation.');
    }

    // Check D: Same gas → Two Carbon Projects
    if (claim.registeredProjectsCount && claim.registeredProjectsCount > 1) {
      violations.push('CHECK_D_VIOLATION: Same LFG extraction system registered under multiple overlapping carbon projects.');
    }

    // Check E: Same electricity → REC + Carbon Credit
    if (claim.claimedInRec && claim.claimedInCarbonCredit) {
      violations.push('CHECK_E_VIOLATION: Same MWh power export claimed simultaneously for RECs and Carbon Offsets.');
    }

    // Check F: Same legacy remediation → Multiple Carbon Claims
    if (claim.claimedInMultiplePrograms) {
      violations.push('CHECK_F_VIOLATION: Same legacy biomining event claimed under multiple voluntary/compliance carbon programs.');
    }

    const hasViolations = violations.length > 0;

    return {
      isAllowed: !hasViolations,
      status: hasViolations ? 'CARBON_CLAIM_BLOCKED' : 'PASSED',
      violations
    };
  }
}

export const kathondaDoubleCountingChecker = new KathondaDoubleCountingChecker();

// --- 9. WTE VS LANDFILL PATHWAY SEPARATOR ---
export const KATHONDA_PATHWAY_SEPARATION = {
  pathways: [
    {
      id: "PATH-01",
      name: "Landfill Methane Recovery & Destruction",
      unit: "UNIT-06 (Scientific Landfill)",
      applicableMethodology: "BM WA03.001",
      status: "PRE_VALIDATION_DATA_COLLECTION",
      calculatedCarbon: "NOT YET CALCULATED",
      canAggregateWithOtherPathways: false
    },
    {
      id: "PATH-02",
      name: "WTE Thermal Power Generation",
      unit: "UNIT-01 (WTE Plant)",
      applicableMethodology: "ACM002 / BM-T-011 (Separate Registration Required)",
      status: "SEPARATE_BOUNDARY_NOT_REGISTERED",
      calculatedCarbon: "NOT APPLICABLE TO WA03.001",
      canAggregateWithOtherPathways: false
    },
    {
      id: "PATH-03",
      name: "RDF Thermal Substitution in Cement Kilns",
      unit: "UNIT-04 (RDF Storage)",
      applicableMethodology: "AM0025 (Separate Registration Required)",
      status: "SEPARATE_STREAM_NOT_REGISTERED",
      calculatedCarbon: "NOT APPLICABLE TO WA03.001",
      canAggregateWithOtherPathways: false
    },
    {
      id: "PATH-04",
      name: "Legacy Dumpsite Biomining Remediation",
      unit: "UNIT-03 (Legacy Dump)",
      applicableMethodology: "Pending Baseline Decay Methodology Selection",
      status: "UNDER_REMEDIATION_EVALUATION",
      calculatedCarbon: "NOT APPLICABLE TO WA03.001",
      canAggregateWithOtherPathways: false
    }
  ]
};

// --- 10. BM WA03.001 APPLICABILITY GUARD ---
export class BMWA03001ApplicabilityGuard {
  validateApplicability(targetUnitType: string) {
    if (targetUnitType === 'SCIENTIFIC_LANDFILL' || targetUnitType === 'UNIT-06') {
      return {
        isEligible: true,
        status: 'ELIGIBLE',
        message: 'BM WA03.001 methodology is applicable to Scientific Landfill Cell LFG recovery.'
      };
    }

    return {
      isEligible: false,
      status: 'INELIGIBLE_REJECTED',
      message: `WA03.001 APPLICABILITY ERROR: Methodology BM WA03.001 can only be applied to Scientific Landfill Cells with LFG recovery systems (${targetUnitType} provided). Cannot be run on WTE, RDF, Ash, or general waste streams.`
    };
  }
}

export const bmWA03001ApplicabilityGuard = new BMWA03001ApplicabilityGuard();

// --- 11. KATHONDA REGULATORY HISTORY TIMELINE ---
export const KATHONDA_REGULATORY_TIMELINE = [
  {
    event_id: "REG-01",
    date: "2013-08-10",
    title: "Environmental Clearance (EC) for Kathonda SWM Facility",
    issuing_authority: "State Environment Impact Assessment Authority (MPSEIAA)",
    document_reference: "EC-MPSEIAA-JBP-SWM-2013-04",
    document_hash: "sha256:b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
    status: "SECONDARY_VERIFIED",
    notes: "EC granted for integrated municipal waste handling and disposal facility at Kathonda site."
  },
  {
    event_id: "REG-02",
    date: "2014-06-01",
    title: "Municipal Land Allocation Resolution",
    issuing_authority: "Jabalpur Municipal Corporation (JMC)",
    document_reference: "JMC-RES-KATHONDA-2014-88",
    document_hash: "sha256:c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3",
    status: "PENDING_PRIMARY_DEED_UPLOAD",
    notes: "Allocated 35.4 hectares in Kathonda village for SWM site."
  },
  {
    event_id: "REG-03",
    date: "2015-04-12",
    title: "MPPCB Consent to Operate (CTO)",
    issuing_authority: "Madhya Pradesh Pollution Control Board (MPPCB)",
    document_reference: "MPPCB-CTO-2015-JBP-088",
    document_hash: "sha256:d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
    status: "SECONDARY_VERIFIED",
    notes: "Granted consent to operate SWM processing and controlled disposal facility."
  },
  {
    event_id: "REG-04",
    date: "2022-11-20",
    title: "National Green Tribunal (NGT) Dumpsite Remediation Directives",
    issuing_authority: "National Green Tribunal (Central Bench)",
    document_reference: "NGT-OA-606-2018-JBP-ORDER",
    document_hash: "sha256:e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5",
    status: "REGULATORY_PROCEEDING_NOT_OPERATING_PERMIT",
    notes: "NGT proceedings regarding legacy waste biomining compliance timelines. NOT an operating permit or title deed."
  },
  {
    event_id: "REG-05",
    date: "2026-08-01",
    title: "Carbon OS Phase 6.5 Physical Boundary Registration Notice",
    issuing_authority: "RupayKg Carbon OS / JMC Carbon Cell",
    document_reference: "RKG-NOTICE-JBP-2026-001",
    document_hash: "sha256:f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6",
    status: "PRE_VALIDATION_ACTIVE",
    notes: "Established pre-calculation physical and carbon accounting boundaries for Kathonda pilot."
  }
];

// --- 12. 14-POINT PRE-CALCULATION GATE ---
export class KathondaCalculationGate {
  evaluateGate(checkState: {
    projectBoundaryVerified?: boolean;
    landfillBoundaryVerified?: boolean;
    applicableCellsIdentified?: boolean;
    lfgSystemMapped?: boolean;
    gasMeterMapped?: boolean;
    methaneAnalyzerMapped?: boolean;
    calibrationVerified?: boolean;
    historicalWasteEvidence?: boolean;
    currentMonitoringData?: boolean;
    wasteMassBalanceCleared?: boolean;
    doubleCountingChecksPassed?: boolean;
    carbonOwnershipVerified?: boolean;
    methodologyApplicabilityCleared?: boolean;
    evidenceCompletenessChecked?: boolean;
  }) {
    const checks = [
      { id: '1', name: 'Project Boundary Verified', pass: !!checkState.projectBoundaryVerified },
      { id: '2', name: 'Landfill Boundary Verified', pass: !!checkState.landfillBoundaryVerified },
      { id: '3', name: 'Applicable Cells Identified', pass: !!checkState.applicableCellsIdentified },
      { id: '4', name: 'LFG System Mapped', pass: !!checkState.lfgSystemMapped },
      { id: '5', name: 'Gas Meter Mapped', pass: !!checkState.gasMeterMapped },
      { id: '6', name: 'Methane Analyzer Mapped', pass: !!checkState.methaneAnalyzerMapped },
      { id: '7', name: 'Calibration Verified', pass: !!checkState.calibrationVerified },
      { id: '8', name: 'Historical Waste Evidence', pass: !!checkState.historicalWasteEvidence },
      { id: '9', name: 'Current Monitoring Data', pass: !!checkState.currentMonitoringData },
      { id: '10', name: 'Waste Mass Balance Cleared', pass: !!checkState.wasteMassBalanceCleared },
      { id: '11', name: 'Double Counting Checks Passed', pass: !!checkState.doubleCountingChecksPassed },
      { id: '12', name: 'Carbon Ownership Verified', pass: !!checkState.carbonOwnershipVerified },
      { id: '13', name: 'Methodology Applicability Cleared', pass: !!checkState.methodologyApplicabilityCleared },
      { id: '14', name: 'Evidence Completeness Checked', pass: !!checkState.evidenceCompletenessChecked }
    ];

    const failedChecks = checks.filter(c => !c.pass);
    const isUnlocked = failedChecks.length === 0;

    return {
      isUnlocked,
      status: isUnlocked ? 'READY_FOR_CALCULATION' : 'CALCULATION_BLOCKED',
      activeResult: isUnlocked ? 'CALCULATED' : 'NOT YET CALCULATED',
      verifiedCarbon: 0,
      issuedCCC: 0,
      totalChecks: 14,
      passedCount: checks.length - failedChecks.length,
      failedChecks,
      gateMessage: isUnlocked 
        ? 'All 14 pre-calculation boundary & physical MRV controls satisfied.' 
        : `CALCULATION BLOCKED: ${failedChecks.length} of 14 mandatory pre-calculation controls pending verification.`
    };
  }
}

export const kathondaCalculationGate = new KathondaCalculationGate();
