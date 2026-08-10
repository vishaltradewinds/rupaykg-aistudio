import { WA03_001 } from '../../packages/methodology/wa03-001/index.ts';
import { BMT011 } from '../../packages/methodology/tools/bm-t-011/index.ts';
import { 
  realProjectIntakeEngine, realProjectEligibilityEngine, 
  cctsSubmissionGateway, certificateModel, acvaSelectionEngine,
  JABALPUR_LANDFILL_FACILITY, JABALPUR_SITE_CANDIDATES
} from '../services/carbonOsService.ts';
import { 
  KATHONDA_COMPLEX_FACILITY, KATHONDA_SUB_UNITS,
  gasMeterTraceabilityEngine, kathondaMassBalanceEngine,
  kathondaDoubleCountingChecker, bmWA03001ApplicabilityGuard,
  kathondaCalculationGate
} from '../services/kathondaBoundaryService.ts';
import {
  SIHORA_RURAL_RESOURCE_HUB, SIHORA_RURAL_SUB_UNITS, SIHORA_RURAL_PROJECT_BOUNDARY,
  SIHORA_RURAL_CARBON_ACCOUNTING_BOUNDARY, SIHORA_RURAL_PATHWAY_SEPARATION,
  ruralBiomassMassBalanceEngine, ruralDoubleCountingChecker, ruralCalculationGate
} from '../services/ruralBoundaryService.ts';
import { LEGACY_GAZIPUR_FIXTURE, validateGazipurDataIsolation } from '../../legacy/pilot-fixtures/gazipur/legacyGazipurFixture.ts';

export async function runTests() {
  console.log("Running Carbon OS Regression & Phase 6.5 Kathonda Boundary Tests...");

  // 1. BM-T-011 test
  const avoided = BMT011.calculateMethaneAvoided(100, 0.15, 0.05, 2026, 2025);
  console.log("BM-T-011 Avoided:", avoided);

  // 2. WA03.001 detailed mathematical reconciliation test
  const inputs = {
    F_CH4_PJ_y: 1000,
    F_CH4_BL_y: 150,
    PE_y: 14,
    LE_y: 0
  };
  const trace = WA03_001.getDetailedTrace(inputs);
  if (trace.intermediate_steps[0].value !== 850) throw new Error("Step 1 delta_F_CH4 mismatch");
  if (trace.intermediate_steps[1].value !== 23800) throw new Error("Step 2 BE_raw mismatch");
  if (trace.intermediate_steps[2].value !== 21420) throw new Error("Step 3 BE_y mismatch");
  if (trace.result.ERy !== 21406) throw new Error(`Step 4 ERy expected 21406, got ${trace.result.ERy}`);
  console.log("WA03.001 Mathematical Step-by-Step Reconciliation PASSED:", trace.result.ERy, "tCO2e");

  // 3. Phase 6 Gazipur Legacy Data Contamination Prevention Check
  try {
    validateGazipurDataIsolation(LEGACY_GAZIPUR_FIXTURE.projectId);
    throw new Error("Failed to catch Gazipur legacy fixture contamination");
  } catch (err: any) {
    if (!err.message.includes("CONTAMINATION ERROR")) throw err;
    console.log("Gazipur legacy data contamination prevention check PASSED.");
  }

  // 4. Phase 6 Jabalpur Pilot Facility & Candidates Verification
  if (JABALPUR_LANDFILL_FACILITY.facility_id !== "FAC-JBP-001") throw new Error("Invalid Jabalpur facility ID");
  if (JABALPUR_LANDFILL_FACILITY.owner !== "Jabalpur Municipal Corporation (JMC)") throw new Error("Invalid Jabalpur owner");
  if (JABALPUR_SITE_CANDIDATES.length < 2) throw new Error("Missing Jabalpur site candidates");
  console.log("Jabalpur facility record & site candidates check PASSED.");

  // 5. Phase 5 Intake Engine Validation
  const incompleteIntake = await realProjectIntakeEngine.processIntake("RKG-JBP-WA03-001-001", { projectOwner: "Jabalpur Municipal Corporation" });
  if (incompleteIntake.isComplete) throw new Error("Incomplete intake falsely marked complete");
  console.log("Phase 5 Intake Engine incomplete check PASSED.");

  // 6. Phase 5 Certificate State Machine Validation
  try {
    await certificateModel.transitionState("cert-123", "ISSUED");
    throw new Error("Failed to block ISSUED state without external certificate ID");
  } catch (err: any) {
    if (!err.message.includes("Cannot set certificate state to ISSUED")) throw err;
    console.log("Phase 5 Certificate state machine ISSUED protection PASSED.");
  }

  // 7. Phase 5 CCTS Submission Gateway Adapter Label Validation
  const gatewayRes = await cctsSubmissionGateway.submitProject("RKG-JBP-WA03-001-001", "PROJECT_REGISTRATION", []);
  if (gatewayRes.gateway_label !== 'EXTERNAL CCTS SUBMISSION — MANUAL/CONTROLLED WORKFLOW') {
    throw new Error("Invalid CCTS Gateway adapter label");
  }
  console.log("Phase 5 CCTS Submission Gateway PASSED.");

  // 8. Phase 5 ACVA Conflict Check Validation
  try {
    await acvaSelectionEngine.appointACVA("proj-1", "acva-1", "Price", true);
    throw new Error("Failed to block conflicted ACVA appointment");
  } catch (err: any) {
    if (!err.message.includes("BLOCKED due to declared conflict")) throw err;
    console.log("Phase 5 ACVA conflict check PASSED.");
  }

  // 9. Phase 6.5 Kathonda Boundary & Segregation Acceptance Test (RKG-JBP-KATHONDA-BOUNDARY-001)
  console.log("Testing RKG-JBP-KATHONDA-BOUNDARY-001...");
  if (KATHONDA_COMPLEX_FACILITY.facility_id !== 'KATHONDA-COMPLEX-JBP') {
    throw new Error("Invalid Kathonda parent facility ID");
  }
  if (KATHONDA_SUB_UNITS.length !== 7) {
    throw new Error(`Expected 7 operational sub-units, found ${KATHONDA_SUB_UNITS.length}`);
  }

  // Test Gas Meter Traceability
  const validMeterTrace = gasMeterTraceabilityEngine.verifyTraceability("FM-JBP-01", "CELL-01", "LFG-SYS-JBP-01");
  if (!validMeterTrace.isTraceable) {
    throw new Error("Valid gas meter FM-JBP-01 failed traceability verification");
  }
  const invalidMeterTrace = gasMeterTraceabilityEngine.verifyTraceability("FM-UNMAPPED-99", "CELL-01", "LFG-SYS-JBP-01");
  if (invalidMeterTrace.isTraceable) {
    throw new Error("Unmapped gas meter passed traceability verification illegally");
  }

  // Test Mass Balance Reconciler
  const balancedMb = kathondaMassBalanceEngine.calculateMassBalance({
    freshMswInTonnes: 480,
    wteFeedTonnes: 150,
    rdfProdTonnes: 120,
    compostProdTonnes: 80,
    landfillDisposalTonnes: 100,
    recycledProdTonnes: 30
  });
  if (balancedMb.status !== 'BALANCED') throw new Error(`Expected BALANCED mass balance, got ${balancedMb.status}`);

  const imbalancedMb = kathondaMassBalanceEngine.calculateMassBalance({
    freshMswInTonnes: 500,
    wteFeedTonnes: 100,
    rdfProdTonnes: 100,
    compostProdTonnes: 50,
    landfillDisposalTonnes: 50,
    recycledProdTonnes: 20
  });
  if (imbalancedMb.status === 'BALANCED') throw new Error("Failed to detect imbalanced mass balance");

  // Test Double Counting Matrix
  const dcAuditViolation = kathondaDoubleCountingChecker.runDoubleCountingAudit({
    claimedInWte: true,
    claimedInLandfill: true,
    claimedInRdf: false,
    claimedInLegacyLandfill: false,
    claimedInFlaring: false,
    claimedInElectricityGen: false,
    registeredProjectsCount: 1,
    claimedInRec: false,
    claimedInCarbonCredit: false,
    claimedInMultiplePrograms: false
  });
  if (dcAuditViolation.status !== 'CARBON_CLAIM_BLOCKED' || dcAuditViolation.isAllowed) {
    throw new Error("Failed to block double-counted WTE + Landfill carbon claim");
  }

  // Test BM WA03.001 Applicability Guard
  const wa03Allowed = bmWA03001ApplicabilityGuard.validateApplicability("SCIENTIFIC_LANDFILL");
  if (!wa03Allowed.isEligible) throw new Error("UNIT-06 Landfill rejected for WA03.001");

  const wa03Blocked = bmWA03001ApplicabilityGuard.validateApplicability("WTE_PLANT");
  if (wa03Blocked.isEligible) throw new Error("UNIT-01 WTE illegally accepted for WA03.001");

  // Test 14-Point Pre-Calculation Gate
  const gateEvalBlocked = kathondaCalculationGate.evaluateGate({
    projectBoundaryVerified: false,
    landfillBoundaryVerified: false,
    applicableCellsIdentified: true,
    lfgSystemMapped: false,
    gasMeterMapped: false,
    methaneAnalyzerMapped: false,
    calibrationVerified: false,
    historicalWasteEvidence: true,
    currentMonitoringData: false,
    wasteMassBalanceCleared: true,
    doubleCountingChecksPassed: true,
    carbonOwnershipVerified: false,
    methodologyApplicabilityCleared: true,
    evidenceCompletenessChecked: false,
  });
  if (gateEvalBlocked.isUnlocked || gateEvalBlocked.status !== 'CALCULATION_BLOCKED') {
    throw new Error("Calculation Gate illegally unlocked with unverified checks");
  }

  console.log("RKG-JBP-KATHONDA-BOUNDARY-001 Acceptance Test PASSED.");

  // 12. Acceptance Test RKG-JBP-SIHORA-RURAL-BOUNDARY-001
  console.log("Running Acceptance Test RKG-JBP-SIHORA-RURAL-BOUNDARY-001 (Sihora Rural Hub & Gobar-Dhan Boundary)...");

  // Verify Parent Hub & LGD Mapping
  if (SIHORA_RURAL_RESOURCE_HUB.facility_id !== 'SIHORA-RURAL-HUB-JBP') {
    throw new Error("Sihora Rural Parent Hub ID mismatch");
  }
  if (SIHORA_RURAL_PROJECT_BOUNDARY.participating_gps.length !== 13) {
    throw new Error("Expected 13 participating Gram Panchayats including Panagar");
  }
  if (SIHORA_RURAL_SUB_UNITS.length !== 8) {
    throw new Error("Expected 8 rural sub-units");
  }

  // Test Rural Mass Balance
  const ruralMbBalanced = ruralBiomassMassBalanceEngine.calculateMassBalance({
    rawGobarInTonnes: 28,
    paddyStrawInTonnes: 22,
    organicWasteInTonnes: 10,
    bioCngProducedKg: 1200, // 1.2 Tonnes
    fomLiquidProducedTonnes: 20,
    briquettesProducedTonnes: 18,
    biocharProducedTonnes: 4,
    vermicompostProducedTonnes: 6
  });
  if (ruralMbBalanced.status !== 'BALANCED') {
    throw new Error(`Rural mass balance failed reconciliation: ${ruralMbBalanced.message}`);
  }

  // Test Rural Double Counting Matrix Block
  const ruralDcViolation = ruralDoubleCountingChecker.runDoubleCountingAudit({
    stubbleClaimedInBurningAvoidance: true,
    stubbleClaimedInPowerGridOffset: true
  });
  if (ruralDcViolation.isAllowed || ruralDcViolation.status !== 'CARBON_CLAIM_BLOCKED') {
    throw new Error("Failed to block double-counted stubble claim");
  }

  // Test Rural 14-Point Pre-Calculation Control Gate
  const ruralGateBlocked = ruralCalculationGate.evaluateGate({
    lgdCodeVerified: true,
    hubLandDeedVerified: false // Unverified
  });
  if (ruralGateBlocked.isUnlocked || ruralGateBlocked.status !== 'RURAL_CALCULATION_BLOCKED') {
    throw new Error("Rural Calculation Gate illegally unlocked with unverified land deed");
  }

  console.log("RKG-JBP-SIHORA-RURAL-BOUNDARY-001 Acceptance Test PASSED.");

  console.log("All Phase 6.5 Urban & Rural Boundary Carbon OS tests passed successfully.");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
