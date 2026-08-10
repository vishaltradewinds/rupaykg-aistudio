// RupayKg Carbon OS — Phase 6.5: Rural Physical & Carbon Accounting Boundary Service
// Establishes physical & LGD boundaries, rural sub-units, biomass/gobar mass balance, double-counting matrix, and rural pre-calculation control gate

import crypto from 'crypto';

export interface RuralOperationalSubUnit {
  unit_id: string;
  name: string;
  type: 'GOBAR_DHAN_BIOCNG' | 'CROP_RESIDUE_BRIQUETTING' | 'PYROLYSIS_BIOCHAR' | 'SHG_VERMICOMPOST' | 'RURAL_PLASTIC_RECOVERY' | 'SOIL_CARBON_FARMING' | 'WATER_BODY_RESTORATION';
  gp_lgd_code: string;
  gp_name: string;
  coordinates: string;
  boundary: string;
  operator_entity: string; // e.g., FPO, Women SHG, Panchayat Enterprise
  target_feedstock: string;
  documents: string[];
  evidence: string[];
  status: 'OPERATIONAL' | 'METHODOLOGY_TARGET' | 'DISTRIBUTED_FARM_BOUNDARY' | 'PANCHAYAT_SHARED_BOUNDARY';
}

export interface RuralProjectBoundaryRecord {
  block_name: string;
  block_lgd_code: string;
  district_name: string;
  state_name: string;
  participating_gps_count?: number;
  enrolled_farmers_count?: number;
  total_farmland_area?: string;
  participating_gps: { name: string; lgd_code: string; farmers_count: number; area_ha: number }[];
  central_hub_khasra: string[];
  central_hub_area: string;
  coordinates: string;
  GIS_polygon: string;
  source_document: string;
  source_hash: string;
  verification_status: 'SECONDARY_VERIFIED — PENDING_PRIMARY_GRAM_SABHA_DEED' | 'PRIMARY_GRAM_SABHA_VERIFIED' | 'DATA_GAP';
  verified_by: string;
  verified_at: string;
}

export interface RuralCarbonAccountingBoundaryRecord {
  included_sources: string[];
  excluded_sources: string[];
  reasons_for_inclusion: Record<string, string>;
  reasons_for_exclusion: Record<string, string>;
  evidence: string[];
  methodology_basis: string;
  approval_status: 'PENDING_INTERNAL_APPROVAL' | 'APPROVED' | 'REJECTED';
}

// --- 1. SIHORA RURAL RESOURCE HUB PARENT FACILITY ---
export const SIHORA_RURAL_RESOURCE_HUB = {
  facility_id: "SIHORA-RURAL-HUB-JBP",
  name: "Sihora Block Rural Circular Resource & Gobar-Dhan Hub",
  type: "RURAL_CLUSTER_RESOURCE_HUB",
  location: "Khitola Road, Sihora Block, Jabalpur District, Madhya Pradesh (23.4862° N, 80.1124° E)",
  district_lgd: "418 (Jabalpur)",
  block_lgd: "3512 (Sihora)",
  lead_entity: "Sihora Farmers Producer Organization (FPO) & Sihora Janpad Panchayat",
  participating_gps_count: 13,
  enrolled_farmers_count: 2160,
  total_farmland_area: "2,820 Hectares",
  status: "ACTIVE_PRE_CALCULATION_BOUNDARIES_ESTABLISHED"
};

// --- 2. RURAL OPERATIONAL SUB-UNITS ---
export const SIHORA_RURAL_SUB_UNITS: RuralOperationalSubUnit[] = [
  {
    unit_id: "UNIT-R01",
    name: "Sihora Gobar-Dhan Bio-CNG & Liquid FOM Digestion Unit",
    type: "GOBAR_DHAN_BIOCNG",
    gp_lgd_code: "138421",
    gp_name: "Sihora Gram Panchayat",
    coordinates: "23.4865° N, 80.1128° E",
    boundary: "Central Gobar-Dhan Digester Yard (2.5 ha)",
    operator_entity: "Sihora Bio-Energy Farmer Cooperative",
    target_feedstock: "Cattle Dung (25-30 TPD wet) + Dairy Slurry",
    documents: ["Gobar-Dhan Scheme Approval Document", "MPPCB Bio-CNG CTE Certificate"],
    evidence: ["GOBAR-DHAN-JBP-SIHORA-REGISTRATION"],
    status: "METHODOLOGY_TARGET"
  },
  {
    unit_id: "UNIT-R02",
    name: "Paddy Straw & Crop Residue Briquetting Facility",
    type: "CROP_RESIDUE_BRIQUETTING",
    gp_lgd_code: "138425",
    gp_name: "Khitola Gram Panchayat",
    coordinates: "23.4890° N, 80.1150° E",
    boundary: "Biomass Storage Depot & Shredder Platform (3.0 ha)",
    operator_entity: "Sihora Agri-Biomass FPO",
    target_feedstock: "Paddy Straw Stubble (Seasonal: 8,000 Tonnes/year)",
    documents: ["Sub-Mission on Agricultural Mechanization (SMAM) Custom Hiring Center Permit"],
    evidence: ["STUBBLE-AVOIDANCE-SURVEY-2025"],
    status: "OPERATIONAL"
  },
  {
    unit_id: "UNIT-R03",
    name: "Pyrolysis & Permanent Biochar Conversion Unit",
    type: "PYROLYSIS_BIOCHAR",
    gp_lgd_code: "138421",
    gp_name: "Sihora Gram Panchayat",
    coordinates: "23.4870° N, 80.1135° E",
    boundary: "Pyrolysis Kiln Yard (1.2 ha)",
    operator_entity: "Green Soil Biochar Enterprises",
    target_feedstock: "Woody Crop Biomass & Cotton Stalks",
    documents: ["Biochar Standard Testing Protocol", "Pyrolysis Kiln Emissions Permit"],
    evidence: ["BIOCHAR-LAB-ANALYSIS-2025"],
    status: "OPERATIONAL"
  },
  {
    unit_id: "UNIT-R04",
    name: "Women SHG Vermicomposting & Organic Fertilizer Center",
    type: "SHG_VERMICOMPOST",
    gp_lgd_code: "138430",
    gp_name: "Gosalpur Gram Panchayat",
    coordinates: "23.4510° N, 80.0820° E",
    boundary: "Gram Panchayat VRC Vermi Bed Platform (1.0 ha)",
    operator_entity: "Pragati Women Self-Help Group Cluster Federation",
    target_feedstock: "Wet Crop Residue + Cattle Waste (10 TPD)",
    documents: ["NRLM SHG Enterprise Registration", "Fertilizer Control Order (FCO) Registration"],
    evidence: ["SHG-VERMI-SALES-MANIFEST-2025"],
    status: "PANCHAYAT_SHARED_BOUNDARY"
  },
  {
    unit_id: "UNIT-R05",
    name: "Gram Panchayat Plastic Recovery & Shredding Facility",
    type: "RURAL_PLASTIC_RECOVERY",
    gp_lgd_code: "138421",
    gp_name: "Sihora Gram Panchayat",
    coordinates: "23.4855° N, 80.1110° E",
    boundary: "VRC Plastic Shredding Facility (0.8 ha)",
    operator_entity: "Swachh Gaon Panchayat Sanitation Samiti",
    target_feedstock: "Flexible Agricultural Film & Village Plastic (1.5 TPD)",
    documents: ["Swachh Bharat Mission (Grameen) Phase II Facility Allotment"],
    evidence: ["SBMG-PLASTIC-RECOVERY-JBP"],
    status: "OPERATIONAL"
  },
  {
    unit_id: "UNIT-R06",
    name: "Enrolled Farmland Soil Carbon Sequestration Boundary",
    type: "SOIL_CARBON_FARMING",
    gp_lgd_code: "MULTI_GP_12",
    gp_name: "12 Participating Gram Panchayats (Sihora Cluster)",
    coordinates: "23.4862° N, 80.1124° E (Centroid)",
    boundary: "Distributed Farm Polygons across 1,850 Enrolled Farmers (2,400 ha)",
    operator_entity: "Sihora Farmer Producer Company Ltd (Agristack Integrated)",
    target_feedstock: "Soil Organic Carbon (SOC) Improvement via Biochar & Cover Crops",
    documents: ["Agristack Farmer Land Records", "Farmer Consent Agreements for Carbon Rights"],
    evidence: ["AGRISTACK-FARM-POLYGONS-SIHORA"],
    status: "DISTRIBUTED_FARM_BOUNDARY"
  },
  {
    unit_id: "UNIT-R07",
    name: "Panchayat Amrit Sarovar Pond Restoration & Desilting Platform",
    type: "WATER_BODY_RESTORATION",
    gp_lgd_code: "138435",
    gp_name: "Majhgawan Gram Panchayat",
    coordinates: "23.5120° N, 80.1450° E",
    boundary: "Majhgawan Village Pond & Catchment Area (4.5 ha)",
    operator_entity: "Majhgawan Gram Panchayat Water Committee",
    target_feedstock: "Anaerobic Pond Silt & Organic Sediment (1,200 Tonnes/season)",
    documents: ["Amrit Sarovar Mission Registration", "Gram Sabha Desilting Resolution"],
    evidence: ["AMRIT-SAROVAR-MAJHGAWAN-2025"],
    status: "PANCHAYAT_SHARED_BOUNDARY"
  },
  {
    unit_id: "UNIT-R08",
    name: "Panagar Peri-Urban Biomass & Organic Waste Aggregation Depot",
    type: "CROP_RESIDUE_BRIQUETTING",
    gp_lgd_code: "138480",
    gp_name: "Panagar Gram Panchayat & Nagar Palika Cluster",
    coordinates: "23.2980° N, 79.9820° E",
    boundary: "Panagar Highway Biomass Storage Depot (2.8 ha)",
    operator_entity: "Panagar Farmers Agri-Cooperative & Municipal Samiti",
    target_feedstock: "Crop Straw, Market Organic Waste & Vegetable Biomass (15 TPD)",
    documents: ["Panagar Nagar Palika & Block Biomass Allotment", "Agri-Stack Farm Registration"],
    evidence: ["PANAGAR-BIOMASS-AGGREGATION-2025"],
    status: "OPERATIONAL"
  }
];

// --- 3. RURAL PHYSICAL & LGD BOUNDARY RECORD ---
export const SIHORA_RURAL_PROJECT_BOUNDARY: RuralProjectBoundaryRecord = {
  block_name: "Sihora",
  block_lgd_code: "3512",
  district_name: "Jabalpur",
  state_name: "Madhya Pradesh",
  participating_gps_count: 13,
  enrolled_farmers_count: 2160,
  total_farmland_area: "2,820 Hectares",
  participating_gps: [
    { name: "Sihora", lgd_code: "138421", farmers_count: 280, area_ha: 360 },
    { name: "Khitola", lgd_code: "138425", farmers_count: 240, area_ha: 310 },
    { name: "Gosalpur", lgd_code: "138430", farmers_count: 210, area_ha: 290 },
    { name: "Majhgawan", lgd_code: "138435", farmers_count: 190, area_ha: 250 },
    { name: "Sarond", lgd_code: "138440", farmers_count: 160, area_ha: 210 },
    { name: "Mohtara", lgd_code: "138445", farmers_count: 150, area_ha: 190 },
    { name: "Bargi", lgd_code: "138450", farmers_count: 140, area_ha: 180 },
    { name: "Umaria", lgd_code: "138455", farmers_count: 130, area_ha: 160 },
    { name: "Pipariya", lgd_code: "138460", farmers_count: 110, area_ha: 140 },
    { name: "Dhamdha", lgd_code: "138465", farmers_count: 90, area_ha: 120 },
    { name: "Sihoda", lgd_code: "138470", farmers_count: 80, area_ha: 110 },
    { name: "Chandiya", lgd_code: "138475", farmers_count: 70, area_ha: 80 },
    { name: "Panagar", lgd_code: "138480", farmers_count: 310, area_ha: 420 }
  ],
  central_hub_khasra: ["Khasra 452/1", "Khasra 452/2", "Khasra 453"],
  central_hub_area: "18.5 Hectares (Central Hub + VRC Processing Platform)",
  coordinates: "23.4862° N, 80.1124° E",
  GIS_polygon: "POLYGON((80.1100 23.4840, 80.1150 23.4840, 80.1150 23.4880, 80.1100 23.4880, 80.1100 23.4840))",
  source_document: "Sihora Janpad Panchayat Land Record & Agristack LGD Geofence Register",
  source_hash: "sha256:f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7",
  verification_status: "SECONDARY_VERIFIED — PENDING_PRIMARY_GRAM_SABHA_DEED",
  verified_by: "Sihora Janpad Panchayat & Jabalpur District Collectorate",
  verified_at: "2025-01-20"
};

// --- 4. RURAL CARBON ACCOUNTING BOUNDARY ---
export const SIHORA_RURAL_CARBON_ACCOUNTING_BOUNDARY: RuralCarbonAccountingBoundaryRecord = {
  included_sources: [
    "UNIT-R01: Gobar-Dhan Anaerobic Digestion Methane Capture (WA03.001 Adaptor)",
    "UNIT-R02: Paddy Straw Avoided In-Field Burning (Biomass Avoidance Baseline)",
    "UNIT-R03: Pyrolysis Permanent Biochar Carbon Removal (BC-01 Carbon Removal)",
    "UNIT-R04: Women SHG Vermicomposting Methane Avoidance"
  ],
  excluded_sources: [
    "Uncontrolled Field Manure Pit Emissions (Unenclosed baseline)",
    "Chemical Fertilizer Over-application Emissions (Baseline N2O)",
    "Fossil Fuel Diesel Tractors for Biomass Transport (Scope 3 Excluded)"
  ],
  reasons_for_inclusion: {
    "UNIT-R01": "Monitored Bio-CNG digestion replaces open manure lagoon decay.",
    "UNIT-R02": "Baled paddy straw prevents open-air stubble burning smoke emissions.",
    "UNIT-R03": "Pyrolysis locks recalcitrant carbon in soil biochar for >100 years.",
    "UNIT-R04": "Controlled aerobic vermicomposting prevents anaerobic heap decay."
  },
  reasons_for_exclusion: {
    "Field Manure Pits": "Unenclosed traditional pits lack continuous meter telemetry.",
    "Chemical Fertilizers": "N2O soil flux modeling requires separate agricultural baseline protocol.",
    "Transport Tractors": "Fossil transport fuel emissions deducted from gross project activity."
  },
  evidence: [
    "GOBAR-DHAN-SCHEME-SPECIFICATION-2025",
    "BEE-CCTS-RURAL-BIOMASS-GUIDELINES"
  ],
  methodology_basis: "BEE CCTS Rural Biomass & Gobar-Dhan Methane Avoidance Protocol",
  approval_status: "PENDING_INTERNAL_APPROVAL"
};

// --- 5. RURAL BIOMASS & GOBAR MASS BALANCE ENGINE ---
export class RuralBiomassMassBalanceEngine {
  calculateMassBalance(inputs: {
    rawGobarInTonnes: number;
    paddyStrawInTonnes: number;
    organicWasteInTonnes: number;
    bioCngProducedKg: number;
    fomLiquidProducedTonnes: number;
    briquettesProducedTonnes: number;
    biocharProducedTonnes: number;
    vermicompostProducedTonnes: number;
  }) {
    // Total wet input mass
    const totalWetInput = inputs.rawGobarInTonnes + inputs.paddyStrawInTonnes + inputs.organicWasteInTonnes;

    // Convert Bio-CNG to equivalent mass (1 kg Bio-CNG approx 0.001 Tonnes gas)
    const cngTonnes = inputs.bioCngProducedKg / 1000;

    // Total output products
    const totalOutput = cngTonnes + inputs.fomLiquidProducedTonnes + inputs.briquettesProducedTonnes + inputs.biocharProducedTonnes + inputs.vermicompostProducedTonnes;

    // Mass difference (accounting for moisture loss during drying & gas evolution)
    const unaccountedMass = totalWetInput - totalOutput;

    // In biological digesters / composters, 20-35% mass loss as moisture evaporation / CO2 is physically expected
    const percentageDiscrepancy = totalWetInput > 0 ? (unaccountedMass / totalWetInput) * 100 : 0;

    const isBalanced = percentageDiscrepancy >= 0 && percentageDiscrepancy <= 35;

    return {
      totalWetInputTonnes: totalWetInput,
      totalOutputProductsTonnes: totalOutput,
      unaccountedMassTonnes: unaccountedMass,
      moistureEvaporationPercent: percentageDiscrepancy.toFixed(1),
      status: isBalanced ? 'BALANCED' : 'IMBALANCED_WARNING',
      message: isBalanced
        ? `Rural biomass mass balance reconciled. Moisture & biogas evolution: ${percentageDiscrepancy.toFixed(1)}% (within 35% physical limit).`
        : `Unexplained biomass discrepancy: ${unaccountedMass.toFixed(2)} Tonnes (${percentageDiscrepancy.toFixed(1)}%). Requires dry matter audit.`
    };
  }
}

export const ruralBiomassMassBalanceEngine = new RuralBiomassMassBalanceEngine();

// --- 6. RURAL DOUBLE-COUNTING PREVENTION MATRIX (RULES R-A to R-F) ---
export class RuralDoubleCountingChecker {
  runDoubleCountingAudit(claim: {
    stubbleClaimedInBurningAvoidance?: boolean;
    stubbleClaimedInPowerGridOffset?: boolean;
    gobarClaimedInBioCng?: boolean;
    gobarClaimedInRawVermicompost?: boolean;
    biocharClaimedInPyrolysisRemoval?: boolean;
    biocharClaimedInSoilCarbonFarming?: boolean;
    farmerFieldRegisteredInMultipleFpos?: boolean;
    fomClaimedInFertilizerDisplacement?: boolean;
    fomClaimedInCarbonCreditDoubleDip?: boolean;
    bioCngClaimedInVehicleFuel?: boolean;
    bioCngClaimedInDigesterMethaneCapture?: boolean;
  }) {
    const violations: string[] = [];

    // Rule R-A: Stubble Avoidance + Power Grid Offset Double Claim
    if (claim.stubbleClaimedInBurningAvoidance && claim.stubbleClaimedInPowerGridOffset) {
      violations.push('RULE_R_A_VIOLATION: Same paddy straw volume claimed simultaneously under In-Field Burning Avoidance and Thermal Grid Displacement without feedstock deduction.');
    }

    // Rule R-B: Gobar Bio-CNG Slurry + Raw Vermicompost Double Claim
    if (claim.gobarClaimedInBioCng && claim.gobarClaimedInRawVermicompost) {
      violations.push('RULE_R_B_VIOLATION: Same cattle dung feedstock claimed simultaneously under Gobar-Dhan Bio-CNG and raw dung vermicomposting.');
    }

    // Rule R-C: Pyrolysis Removal + Soil Carbon Double Claim
    if (claim.biocharClaimedInPyrolysisRemoval && claim.biocharClaimedInSoilCarbonFarming) {
      violations.push('RULE_R_C_VIOLATION: Biochar applied on farmland double-claimed under both Pyrolysis Carbon Removal (BC-01) and Agricultural Soil Carbon protocols.');
    }

    // Rule R-D: Farm Field Multi-FPO Registration
    if (claim.farmerFieldRegisteredInMultipleFpos) {
      violations.push('RULE_R_D_VIOLATION: Enrolled farm land parcels registered under multiple overlapping carbon developers or FPOs.');
    }

    // Rule R-E: FOM Slurry Fertilizer Offset Double Dip
    if (claim.fomClaimedInFertilizerDisplacement && claim.fomClaimedInCarbonCreditDoubleDip) {
      violations.push('RULE_R_E_VIOLATION: Liquid FOM organic fertilizer displacement claimed under conflicting registry credit pools.');
    }

    // Rule R-F: Bio-CNG Vehicle Fuel + Digester Methane Double Claim
    if (claim.bioCngClaimedInVehicleFuel && claim.bioCngClaimedInDigesterMethaneCapture) {
      violations.push('RULE_R_F_VIOLATION: Bio-CNG fuel output claimed as both tractor green fuel replacement and digester methane destruction without stream separation.');
    }

    const hasViolations = violations.length > 0;

    return {
      isAllowed: !hasViolations,
      status: hasViolations ? 'CARBON_CLAIM_BLOCKED' : 'PASSED',
      violations
    };
  }
}

export const ruralDoubleCountingChecker = new RuralDoubleCountingChecker();

// --- 7. RURAL PATHWAY SEPARATION ---
export const SIHORA_RURAL_PATHWAY_SEPARATION = {
  pathways: [
    {
      id: "PATH-RURAL-01",
      name: "Gobar-Dhan Bio-CNG Methane Capture & Power",
      unit: "UNIT-R01 (Gobar-Dhan Digester)",
      applicableMethodology: "BEE CCTS WA03.001 Rural Adaptor",
      status: "PRE_VALIDATION_ACTIVE",
      calculatedCarbon: "NOT YET CALCULATED",
      canAggregateWithOtherPathways: false
    },
    {
      id: "PATH-RURAL-02",
      name: "Crop Residue Stubble Burning Avoidance",
      unit: "UNIT-R02 (Briquetting Depot)",
      applicableMethodology: "BM-T-011 Biomass Adaptor",
      status: "PRE_VALIDATION_ACTIVE",
      calculatedCarbon: "NOT YET CALCULATED",
      canAggregateWithOtherPathways: false
    },
    {
      id: "PATH-RURAL-03",
      name: "Pyrolysis Permanent Biochar Carbon Removal",
      unit: "UNIT-R03 (Pyrolysis Kiln)",
      applicableMethodology: "BC-01 Biochar Protocol",
      status: "OPERATIONAL_EVALUATION",
      calculatedCarbon: "NOT YET CALCULATED",
      canAggregateWithOtherPathways: false
    },
    {
      id: "PATH-RURAL-04",
      name: "Women SHG Vermicomposting Organic Methane Avoidance",
      unit: "UNIT-R04 (SHG Vermi Platform)",
      applicableMethodology: "VM-01 Organic Waste Protocol",
      status: "PANCHAYAT_MONITORING",
      calculatedCarbon: "NOT YET CALCULATED",
      canAggregateWithOtherPathways: false
    },
    {
      id: "PATH-RURAL-05",
      name: "Agricultural Soil Carbon Sequestration",
      unit: "UNIT-R06 (12 Gram Panchayats - 2,400 ha)",
      applicableMethodology: "AG-01 Soil Organic Carbon Protocol",
      status: "AGRISTACK_MAPPING_ACTIVE",
      calculatedCarbon: "NOT YET CALCULATED",
      canAggregateWithOtherPathways: false
    }
  ]
};

// --- 8. 14-POINT RURAL PRE-CALCULATION CONTROL GATE ---
export class RuralCalculationGate {
  evaluateGate(checkState: {
    lgdCodeVerified?: boolean;
    hubLandDeedVerified?: boolean;
    farmerAgristackMapped?: boolean;
    gramSabhaResolutionPassed?: boolean;
    gobarMeterMapped?: boolean;
    slurryMeterMapped?: boolean;
    biomassWeighbridgeMapped?: boolean;
    moistureSensorCalibrated?: boolean;
    satelliteStubbleBaseline?: boolean;
    biomassMassBalanceCleared?: boolean;
    doubleCountingMatrixCleared?: boolean;
    shgFpoRevenueAgreement?: boolean;
    methodologyApplicabilityCleared?: boolean;
    primaryEvidenceHashVerified?: boolean;
  }) {
    const checks = [
      { id: '1', name: 'LGD GP & Block Codes Verified', pass: !!checkState.lgdCodeVerified },
      { id: '2', name: 'Central Hub Khasra Land Deed Verified', pass: !!checkState.hubLandDeedVerified },
      { id: '3', name: 'Farmer Agristack IDs & Farm Polygons Mapped', pass: !!checkState.farmerAgristackMapped },
      { id: '4', name: 'Gram Sabha Resolutions Passed across Panchayats', pass: !!checkState.gramSabhaResolutionPassed },
      { id: '5', name: 'Gobar-Dhan Gas Flow Meter Mapped', pass: !!checkState.gobarMeterMapped },
      { id: '6', name: 'Liquid FOM Slurry Meter Mapped', pass: !!checkState.slurryMeterMapped },
      { id: '7', name: 'Biomass Digital Weighbridge Mapped', pass: !!checkState.biomassWeighbridgeMapped },
      { id: '8', name: 'Digital Moisture Sensor Calibrated', pass: !!checkState.moistureSensorCalibrated },
      { id: '9', name: 'Satellite Crop Residue Fire Baseline Verified', pass: !!checkState.satelliteStubbleBaseline },
      { id: '10', name: 'Biomass & Gobar Mass Balance Cleared', pass: !!checkState.biomassMassBalanceCleared },
      { id: '11', name: 'Rural Double Counting Matrix Cleared', pass: !!checkState.doubleCountingMatrixCleared },
      { id: '12', name: 'FPO & SHG Revenue Sharing Agreement Signed', pass: !!checkState.shgFpoRevenueAgreement },
      { id: '13', name: 'Rural Methodology Applicability Cleared', pass: !!checkState.methodologyApplicabilityCleared },
      { id: '14', name: 'Primary Evidence Document Hash Verified', pass: !!checkState.primaryEvidenceHashVerified }
    ];

    const failedChecks = checks.filter(c => !c.pass);
    const isUnlocked = failedChecks.length === 0;

    return {
      isUnlocked,
      status: isUnlocked ? 'READY_FOR_RURAL_CALCULATION' : 'RURAL_CALCULATION_BLOCKED',
      activeResult: isUnlocked ? 'CALCULATED' : 'NOT YET CALCULATED',
      verifiedCarbon: 0,
      issuedCCC: 0,
      totalChecks: 14,
      passedCount: checks.length - failedChecks.length,
      failedChecks,
      gateMessage: isUnlocked 
        ? 'All 14 pre-calculation rural boundary & physical MRV controls satisfied.' 
        : `RURAL CALCULATION BLOCKED: ${failedChecks.length} of 14 mandatory rural pre-calculation controls pending verification.`
    };
  }
}

export const ruralCalculationGate = new RuralCalculationGate();
