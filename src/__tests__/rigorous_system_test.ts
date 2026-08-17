import { 
  generateCarbonEvent, 
  cqe, 
  BEE_APPROVED_METHODOLOGIES, 
  CQEMethodologyRegistry, 
  CQEQAQCEngine, 
  CQEMethodologySelectionEngine,
  CQEMarketPricingEngine,
  WaterfallDoctrineRegistry
} from "../services/carbonEngine.ts";
import { SWMComplianceService } from "../services/swmComplianceEngine.ts";
import { VCService } from "../services/vcService.ts";
import { INDIAN_STATES } from "../constants.ts";
import { getLgdStates, getLgdDistricts } from "../services/lgdDb.ts";

export async function runRigorousSystemTests() {
  console.log("================================================================================");
  console.log("⚡ RUPAYKG ENTERPRISE 3.0 — RIGOROUS SYSTEM OPERATIONAL & OUTCOMES TEST SUITE ⚡");
  console.log("================================================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName} — ${details || 'Assertion failed'}`);
      throw new Error(`Test Failed: ${testName} (${details || ''})`);
    }
  }

  // --------------------------------------------------------------------------
  // TEST SECTION 1: LGD & GOVERNANCE HIERARCHY TEST ACROSS ALL 37 STATES/UTs
  // --------------------------------------------------------------------------
  console.log("▶ 1. Validating LGD Territorial Directory & Spatial State Mappings...");
  const statesList = Object.keys(INDIAN_STATES);
  assert(statesList.length >= 36, "36+ States and Union Territories Present in LGD Map", `Found ${statesList.length} states`);

  let checkedDistricts = 0;
  let checkedAreas = 0;

  for (const state of statesList) {
    const districts = INDIAN_STATES[state];
    const districtNames = Object.keys(districts);
    assert(districtNames.length > 0, `State "${state}" has registered district boundaries`);
    
    for (const dName of districtNames) {
      checkedDistricts++;
      const distObj = districts[dName];
      const hasUrban = Array.isArray(distObj.Urban);
      const hasRural = Array.isArray(distObj.Rural);
      assert(hasUrban && hasRural, `District "${dName}" (${state}) provides Urban & Rural boundary zones`);
      checkedAreas += (distObj.Urban?.length || 0) + (distObj.Rural?.length || 0);
    }
  }
  console.log(`     -> Verified ${statesList.length} States/UTs, ${checkedDistricts} Districts, and ${checkedAreas} Local Area Boundaries.\n`);

  // --------------------------------------------------------------------------
  // TEST SECTION 2: SWM 2016 COMPLIANCE ENGINE & RULE 4/24 VALIDATION
  // --------------------------------------------------------------------------
  console.log("▶ 2. Testing SWM 2016 Compliance Engine & CPCB Verification Pipeline...");
  const swmEngine = new SWMComplianceService();

  // Test 2.1: Register Bulk Waste Generator (BWG)
  const bwgRegistration = await swmEngine.registerEntity({
    type: "BWG",
    name: "Apex Tech City Complex",
    location: {
      state: "Maharashtra",
      district: "Pune",
      ulb: "Pune Municipal Corporation",
      ward: "Shivajinagar Ward 12"
    },
    operationalMetrics: {
      dailyWasteGenerationKg: 450,
      builtUpAreaSqm: 25000,
      wasteCategories: ["Wet/Organic", "Dry Recyclable", "Domestic Hazardous", "Sanitary"]
    }
  });

  assert(!!bwgRegistration.registryId, "BWG Registry ID generated", bwgRegistration.registryId);
  assert(bwgRegistration.cpcbSyncStatus === "Synced", "CPCB Sync Status verified as Synced");
  assert(bwgRegistration.cpcbToken?.startsWith("CPCB-AUTH-"), "CPCB Authentication Token formatted correctly");

  // Test 2.2: SWM Rule 4.1 Segregation Compliance (Full 4 streams present)
  const compliantValidation = await swmEngine.validateCompliance(
    bwgRegistration.registryId,
    "RULE_4_1",
    {
      segregationImages: [
        "https://rkg-evidence.gov.in/img1.jpg",
        "https://rkg-evidence.gov.in/img2.jpg",
        "https://rkg-evidence.gov.in/img3.jpg",
        "https://rkg-evidence.gov.in/img4.jpg"
      ],
      qrVerified: true,
      timestamp: new Date().toISOString()
    }
  );
  assert(compliantValidation.status === "Compliant", "Rule 4.1 4-stream segregation marked Compliant");
  assert(compliantValidation.scoreDelta === 0, "Compliant status incurs 0 penalty points");

  // Test 2.3: SWM Rule 4.1 Non-Compliance (Incomplete segregation streams)
  const nonCompliantValidation = await swmEngine.validateCompliance(
    bwgRegistration.registryId,
    "RULE_4_1",
    {
      segregationImages: ["https://rkg-evidence.gov.in/img1.jpg"], // Only 1 stream!
      qrVerified: false
    }
  );
  assert(nonCompliantValidation.status === "Non-Compliant", "Rule 4.1 incomplete streams flagged Non-Compliant");
  assert(nonCompliantValidation.scoreDelta === -10, "Rule 4.1 violation incurs -10 penalty on compliance score");
  console.log("     -> SWM Compliance Engine validations completed successfully.\n");

  // --------------------------------------------------------------------------
  // TEST SECTION 3: CQE 1.0 — REAL-WORLD QUANTIFICATION & BEE METHODOLOGIES
  // --------------------------------------------------------------------------
  console.log("▶ 3. Testing Carbon Quantification Engine (CQE 1.0) Real-World Calculations...");
  
  // Test 3.1: Active BEE Methodology Registry
  const activeMethodologies = CQEMethodologyRegistry.getAll({ status: 'ACTIVE' });
  assert(activeMethodologies.length >= 5, "BEE Approved Methodology Registry contains active protocols", `Found ${activeMethodologies.length}`);

  // Test 3.2: Methodology Auto-Selection Engine
  const stubbleMethodology = CQEMethodologySelectionEngine.selectMethodology("Paddy Stubble Biomass", "rural");
  assert(stubbleMethodology.methodologyCode === "BM AG04.002", "Paddy Stubble automatically mapped to BM AG04.002");

  const gobarMethodology = CQEMethodologySelectionEngine.selectMethodology("Dairy Cow Dung Gobar", "rural");
  assert(gobarMethodology.methodologyCode === "BM AG04.001", "Gobar mapped to BM AG04.001 Animal Manure Management");

  const landfillMethodology = CQEMethodologySelectionEngine.selectMethodology("Landfill Gas Extraction", "urban");
  assert(landfillMethodology.methodologyCode === "BM WA03.001", "LFG mapped to BM WA03.001 Landfill Methane Recovery");

  const compostMethodology = CQEMethodologySelectionEngine.selectMethodology("Organic Kitchen Waste Compost", "urban");
  assert(compostMethodology.methodologyCode === "BM WA03.002", "Organic waste mapped to BM WA03.002 Avoidance via Composting");

  // Test 3.3: Real Scenario 1 — Urban MSW Aerobic Composting (100 Tonnes Organic Waste)
  const compostQuantification = cqe.quantify(
    {
      activityId: "ACT-MSW-CMP-2026-001",
      timestamp: new Date().toISOString(),
      materialCategory: "Municipal",
      facilityId: "FAC-JBP-CMP-01",
      facilityName: "Jabalpur Central Windrow Composting Facility",
      geoLat: 23.1815,
      geoLong: 79.9864,
      grossVehicleWeightKg: 135000,
      tareWeightKg: 35000,
      netMaterialKg: 100000, // 100 Tonnes
      vehicleId: "MP-20-GA-4412",
      weighbridgeId: "WB-JBP-2026-8841",
      source: "Door-to-Door Municipal Segregation",
      destination: "JMC Solid Waste Division"
    },
    {
      totalWeightKg: 100000,
      compositionType: "Food & Kitchen Waste",
      organicFraction: 0.82,
      moisturePercent: 55.0,
      dryMatterPercent: 45.0,
      degradableOrganicCarbon: 0.15,
      treatmentEfficiency: 0.85,
      isCharacterised: true,
      characterisationSource: "LAB_ASSAY"
    },
    12.0,
    "CONTRACT_PRICE"
  );

  assert(compostQuantification.qaqcResult.isPassed, "Compost Activity Data QA/QC Audit Passed");
  assert(compostQuantification.netVerifiedEligibleTco2e > 0, "Net Emission Reduction (tCO2e) is Positive", `${compostQuantification.netVerifiedEligibleTco2e} tCO2e`);
  assert(compostQuantification.issuedCccQuantity > 0, "CCC Minted units calculated accurately", `${compostQuantification.issuedCccQuantity} CCC`);

  // Verify 3-Ledgers Record Generation
  const threeLedgers = cqe.generateThreeLedgersRecord(
    "REC-CMP-100T",
    {
      activityId: "ACT-MSW-CMP-2026-001",
      grossVehicleWeightKg: 135000,
      tareWeightKg: 35000,
      netMaterialKg: 100000,
      materialCategory: "Municipal"
    },
    75000, // Generator Payout (₹75k)
    25000, // Aggregator Payout (₹25k)
    12.0   // Scenario Price ₹12/CCC
  );
  assert(threeLedgers.materialLedger.netWeightTonnes === 100, "Material Ledger reconciled 100 tonnes input");
  assert(threeLedgers.carbonLedger.quantifiedTco2e === compostQuantification.netVerifiedEligibleTco2e, "Carbon Ledger matched verified tCO2e reduction");
  assert(threeLedgers.financialLedger.carbonCommoditySettlement.totalCarbonValueInr > 0, "Financial Ledger gross value reconciled");

  // Test 3.4: Real Scenario 2 — Rural Crop Residue Stubble Burning Avoidance (50 Tonnes Paddy Straw)
  const stubbleQuantification = cqe.quantify(
    {
      activityId: "ACT-RUR-STU-2026-002",
      timestamp: new Date().toISOString(),
      materialCategory: "Agricultural",
      facilityId: "FAC-SIHORA-BIO-01",
      facilityName: "Sihora FPO Biomass Resource Recovery Centre",
      geoLat: 23.4882,
      geoLong: 80.1114,
      grossVehicleWeightKg: 68000,
      tareWeightKg: 18000,
      netMaterialKg: 50000, // 50 Tonnes
      vehicleId: "MP-20-EA-9912",
      weighbridgeId: "WB-SIH-2026-1029",
      source: "Rural Stubble Aggregation",
      destination: "Sihora Kisan FPO"
    },
    {
      totalWeightKg: 50000,
      compositionType: "Crop Residue (Stubble/Straw)",
      organicFraction: 0.94,
      moisturePercent: 12.0,
      dryMatterPercent: 88.0,
      degradableOrganicCarbon: 0.45,
      treatmentEfficiency: 0.90,
      isCharacterised: true,
      characterisationSource: "LAB_ASSAY"
    },
    15.0,
    "CONTRACT_PRICE"
  );

  assert(stubbleQuantification.qaqcResult.isPassed, "Rural Stubble Aggregation QA/QC Passed");
  assert(stubbleQuantification.netVerifiedEligibleTco2e > 0, "Rural Stubble avoided positive tCO2e emissions", `${stubbleQuantification.netVerifiedEligibleTco2e} tCO2e`);
  assert(stubbleQuantification.waterfallBreakdown.generatorAggregatorShareInr > 0, "Community dividend allocated from carbon proceeds", `₹${stubbleQuantification.waterfallBreakdown.generatorAggregatorShareInr}`);
  console.log("     -> CQE 1.0 real-world quantification tests passed.\n");

  // --------------------------------------------------------------------------
  // TEST SECTION 4: RIGOROUS QA/QC EDGE CASES & ANOMALY INJECTION
  // --------------------------------------------------------------------------
  console.log("▶ 4. Testing QA/QC & Fraud Anomaly Detection Under Injected Stress...");

  // Anomaly 4.1: Gross <= Tare Weight (Tampered Scale)
  const tamperedWeightAudit = CQEQAQCEngine.audit(
    {
      activityId: "ACT-FRAUD-001",
      timestamp: new Date().toISOString(),
      materialCategory: "Municipal",
      facilityId: "FAC-1",
      facilityName: "Test Facility",
      vehicleId: "DL-01-A-1234",
      weighbridgeId: "WB-FAKE",
      source: "Urban Test",
      destination: "MRF",
      batchId: "B-01",
      chainOfCustodyHash: "hash-01",
      geoLat: 28.5,
      geoLong: 77.2,
      grossVehicleWeightKg: 10000,
      tareWeightKg: 12000, // TARE > GROSS
      netMaterialKg: -2000
    },
    {
      totalWeightKg: 10000,
      compositionType: "PET Bottles",
      organicFraction: 0.01,
      moisturePercent: 5.0,
      dryMatterPercent: 95.0,
      degradableOrganicCarbon: 0.0,
      treatmentEfficiency: 0.95,
      isCharacterised: true,
      characterisationSource: "METHODOLOGY_DEFAULT"
    },
    50, 5, 2
  );
  assert(!tamperedWeightAudit.isPassed, "Tampered Weighbridge (Tare > Gross) blocked by QA/QC Engine");
  assert(tamperedWeightAudit.anomalies.some(a => a.code === "QA_ERR_WEIGHT_BALANCE"), "QA_ERR_WEIGHT_BALANCE anomaly detected");

  // Anomaly 4.2: Out of Geographic Bounds (GPS in Arabian Sea)
  const outOfBoundsGpsAudit = CQEQAQCEngine.audit(
    {
      activityId: "ACT-FRAUD-002",
      timestamp: new Date().toISOString(),
      materialCategory: "Municipal",
      facilityId: "FAC-1",
      facilityName: "Test Facility",
      vehicleId: "DL-01-A-1234",
      weighbridgeId: "WB-99",
      source: "Urban Test",
      destination: "MRF",
      batchId: "B-02",
      chainOfCustodyHash: "hash-02",
      geoLat: 0.5, // Equator (Outside India)
      geoLong: 50.0,
      grossVehicleWeightKg: 20000,
      tareWeightKg: 10000,
      netMaterialKg: 10000
    },
    {
      totalWeightKg: 10000,
      compositionType: "PET Bottles",
      organicFraction: 0.01,
      moisturePercent: 5.0,
      dryMatterPercent: 95.0,
      degradableOrganicCarbon: 0.0,
      treatmentEfficiency: 0.95,
      isCharacterised: true,
      characterisationSource: "METHODOLOGY_DEFAULT"
    },
    50, 5, 2
  );
  assert(!outOfBoundsGpsAudit.isPassed, "Out of Indian territorial boundary GPS blocked by QA/QC Engine");
  assert(outOfBoundsGpsAudit.anomalies.some(a => a.code === "QA_ERR_OUT_OF_BOUNDS_GPS"), "QA_ERR_OUT_OF_BOUNDS_GPS anomaly detected");

  // Anomaly 4.3: Negative Net Reduction (BE <= PE + LE)
  const negativeReductionAudit = CQEQAQCEngine.audit(
    {
      activityId: "ACT-FRAUD-003",
      timestamp: new Date().toISOString(),
      materialCategory: "Municipal",
      facilityId: "FAC-1",
      facilityName: "Test Facility",
      vehicleId: "DL-01-A-1234",
      weighbridgeId: "WB-99",
      source: "Urban Test",
      destination: "MRF",
      batchId: "B-03",
      chainOfCustodyHash: "hash-03",
      geoLat: 28.5,
      geoLong: 77.2,
      grossVehicleWeightKg: 20000,
      tareWeightKg: 10000,
      netMaterialKg: 10000
    },
    {
      totalWeightKg: 10000,
      compositionType: "PET Bottles",
      organicFraction: 0.01,
      moisturePercent: 5.0,
      dryMatterPercent: 95.0,
      degradableOrganicCarbon: 0.0,
      treatmentEfficiency: 0.95,
      isCharacterised: true,
      characterisationSource: "METHODOLOGY_DEFAULT"
    },
    10, 15, 5 // BE=10 <= PE+LE=20
  );
  assert(!negativeReductionAudit.isPassed, "Negative net reduction (BE <= PE + LE) blocked by QA/QC Engine");
  assert(negativeReductionAudit.anomalies.some(a => a.code === "QA_ERR_NEGATIVE_REDUCTION"), "QA_ERR_NEGATIVE_REDUCTION anomaly detected");
  console.log("     -> QA/QC Anomaly & Fraud tests passed.\n");

  // --------------------------------------------------------------------------
  // TEST SECTION 5: W3C VERIFIABLE CREDENTIAL & CRYPTOGRAPHIC PROOF TEST
  // --------------------------------------------------------------------------
  console.log("▶ 5. Testing W3C Verifiable Credential (VC) Cryptographic Generation...");

  const mockRecord = {
    id: "REC-2026-JBP-01",
    waste_type: "Wet/Organic Waste",
    weight_kg: 50000,
    geo_lat: 23.1815,
    geo_long: 79.9864,
    timestamp: new Date().toISOString(),
    verification_standard: "ISO 14064-3 / ICM CCTS Readiness",
    icm_methodology_id: "BM WA03.002",
    lgd_state_code: 23,
    lgd_district_code: 405,
    lgd_local_body_code: 900101,
    lgd_local_body_name: "Jabalpur Municipal Corporation",
    lgd_local_body_type: "Urban"
  };

  const mockCarbonEvent = {
    id: "DT-JBP-2026-001",
    net_carbon_reduction_kg_co2e: 28450.5,
    methane_estimate_kg_co2e: 31200.0,
    diversion_estimate_kg_co2e: 45000.0,
    mrv_score: 96.5,
    stakeholder_chain: ["ULB_OPERATOR", "AGGREGATOR_FPO", "PROCESSOR_COMPOST", "ACVA_AUDITOR"]
  };

  const generatedVc = VCService.generateWasteCarbonVC(mockRecord, mockCarbonEvent);

  assert(!!generatedVc.id, "Verifiable Credential generated with unique URI", generatedVc.id);
  assert(generatedVc.type.includes("VerifiableCredential"), "VC contains VerifiableCredential type");
  assert(generatedVc.type.includes("CarbonReductionCredential"), "VC contains CarbonReductionCredential schema");
  assert(!!generatedVc.proof?.proofValue, "Cryptographic Data Integrity Proof attached to VC");
  assert(generatedVc.credentialSubject.carbonMetrics.netReduction.value === 28450.5, "Credential Subject carries verified net reduction metrics");
  assert(generatedVc.credentialSubject.compliance.lgd_local_body_name === "Jabalpur Municipal Corporation", "Credential Subject carries LGD spatial governance metadata");
  console.log("     -> W3C Verifiable Credential cryptographic tests passed.\n");

  // --------------------------------------------------------------------------
  // TEST SECTION 6: FINANCIAL WATERFALL OPERATING DOCTRINE & REVENUE RECONCILIATION
  // --------------------------------------------------------------------------
  console.log("▶ 6. Testing RupayKg Financial Waterfall Operating Doctrine (RKG-DOCTRINE-REV-01)...");
  
  assert(WaterfallDoctrineRegistry.DOCTRINE_ID === "RKG-DOCTRINE-REV-01", "Doctrine ID is RKG-DOCTRINE-REV-01");
  const totalPercentage = WaterfallDoctrineRegistry.DOCTRINAL_TIERS.reduce((acc, t) => acc + t.percentage, 0);
  assert(Math.abs(totalPercentage - 100.0) < 0.001, "Doctrinal tier percentages sum exactly to 100.00%");

  const testPrices = [10.0, 12.0, 15.0, 20.0, 8500.0];
  for (const price of testPrices) {
    const { grossProceedsInr, waterfall } = CQEMarketPricingEngine.calculateWaterfall(1000, price, "CONTRACT_PRICE");
    const expectedGross = 1000 * price;
    assert(grossProceedsInr === expectedGross, `Gross proceeds match for ₹${price}/CCC`);
    
    // Test that platform revenue is exactly 53%
    const expectedPlatform = Number((expectedGross * 0.53).toFixed(2));
    assert(waterfall.rupayKgRevenueInr === expectedPlatform, `Platform revenue is strictly 53% for ₹${price}/CCC (₹${waterfall.rupayKgRevenueInr})`);

    // Test that project owner share is exactly 35%
    const expectedProjectOwner = Number((expectedGross * 0.35).toFixed(2));
    assert(waterfall.projectOwnerShareInr === expectedProjectOwner, `Project owner share is strictly 35% for ₹${price}/CCC (₹${waterfall.projectOwnerShareInr})`);

    // Sum of split allocations must equal gross proceeds (Monetary conservation across 8 tiers)
    const sumAllocations = 
      waterfall.transactionCostsInr +
      waterfall.registryIssuanceCostsInr +
      waterfall.acvaValidationVerificationCostsInr +
      waterfall.projectOwnerShareInr +
      waterfall.generatorAggregatorShareInr +
      waterfall.financierShareInr +
      waterfall.rupayKgRevenueInr;
    
    const delta = Math.abs(sumAllocations - expectedGross);
    assert(delta < 0.05, `Financial waterfall monetary conservation holds for ₹${price}/CCC (Delta: ₹${delta.toFixed(4)})`);

    // Test compliance check
    const compliance = WaterfallDoctrineRegistry.verifyDoctrinalCompliance(waterfall);
    assert(compliance.isCompliant, `Doctrinal compliance verified for ₹${price}/CCC`);

    // Test manifest generator
    const manifest = WaterfallDoctrineRegistry.generateDoctrinalManifest(`TEST-MNFST-${price}`, 1000, price, "CONTRACT_PRICE");
    assert(manifest.conservationMetrics.isConservationVerified, `Cryptographic manifest verified with 0 leakage for ₹${price}/CCC`);
    assert(manifest.legalAttestation.isLegallyBinding, `Manifest carries legally binding attestation for ₹${price}/CCC`);
  }
  console.log("     -> Financial waterfall doctrine & revenue conservation tests passed.\n");

  console.log("================================================================================");
  console.log(`🎉 ALL ${passedTests} RIGOROUS SYSTEM TESTS COMPLETED SUCCESSFULLY (100% PASS RATE) 🎉`);
  console.log("================================================================================");
  return { totalTests, passedTests, success: true };
}
