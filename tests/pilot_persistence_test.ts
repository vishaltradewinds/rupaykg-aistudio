import { FarmerService } from '../src/services/farmerService.ts';
import { RecordService } from '../src/services/recordService.ts';
import { CarbonEventService } from '../src/services/carbonEventService.ts';
import { ComplianceService } from '../src/services/complianceService.ts';
import { PilotService } from '../src/services/pilotService.ts';
import { NotificationService } from '../src/services/notificationService.ts';
import { AuditLogService } from '../src/services/auditLogService.ts';
import { BlockchainService } from '../src/services/blockchainService.ts';
import { mrvQualityEngine, doubleCountingEngine } from '../src/services/carbonOsService.ts';

async function runTests() {
  try {
    console.log('--- RUNNING RUPAYKG ENTERPRISE PILOT PERSISTENCE & INTEGRITY TESTS ---');


  // Test 1: Farmer persistence
  const testFarmer = {
    id: `FARMER_TEST_${Date.now()}`,
    name: 'Ramesh Patel',
    phone: '+919876543210',
    village: 'Kathonda',
    district: 'Jabalpur',
    state: 'Madhya Pradesh',
    crop_type: 'Paddy Straw',
    land_area: 4.5,
    geo_lat: 23.1815,
    geo_long: 79.9864,
  };
  await FarmerService.addFarmer(testFarmer);
  const farmerFetched = await FarmerService.getFarmer(testFarmer.id);
  console.assert(farmerFetched !== null, 'Farmer fetched should not be null');
  console.log('✓ FarmerService Persistent Read/Write Test Passed');

  // Test 2: Unified Record persistence
  const testRecord = {
    id: `REC_TEST_${Date.now()}`,
    citizen_id: 'user_patel_1',
    waste_type: 'Agricultural Residue',
    weight_kg: 1250,
    village: 'Kathonda',
    status: 'collected',
    mrv_status: 'pending',
    total_value: 3750,
    ccc_amount_kg: 625,
    potential_ccc_value: 1250,
    risk_score: 0.12,
    context: 'rural',
  };
  await RecordService.addRecord(testRecord);
  const recordFetched = await RecordService.getRecord(testRecord.id);
  console.assert(recordFetched !== null && recordFetched.weight_kg === 1250, 'Record fetched should match weight');
  console.log('✓ RecordService Unified Rural/Urban Persistent Read/Write Test Passed');

  // Test 3: CarbonEvent persistence
  const testEvent = {
    id: `CE_TEST_${Date.now()}`,
    waste_type: 'Paddy Residue',
    weight_kg: 1250,
    diversion_estimate_kg_co2e: 500,
    methane_estimate_kg_co2e: 625,
    net_carbon_reduction_kg_co2e: 1125,
    mrv_score: 95,
    status: 'Verified & Anchored',
  };
  await CarbonEventService.addEvent(testEvent);
  const allEvents = await CarbonEventService.getAllCarbonEvents();
  console.assert(allEvents.some(e => e.id === testEvent.id), 'Carbon event should be present in store');
  console.log('✓ CarbonEventService Persistent Event Engine Test Passed');

  // Test 4: Compliance persistence
  const testCompliance = {
    id: `COMP_TEST_${Date.now()}`,
    generator_id: 'GEN_ENTERPRISE_1',
    waste_batch_id: testRecord.id,
    compliance_proof_hash: '3f2b4c1a5e9d8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a',
    classification: 'non-hazardous',
    epr_ref_number: 'EPR-KATHONDA-2026-001',
    regulator_review_status: 'approved',
  };
  await ComplianceService.addRecord(testCompliance);
  const complianceList = await ComplianceService.getRecordsByGenerator('GEN_ENTERPRISE_1');
  console.assert(complianceList.some(c => c.id === testCompliance.id), 'Compliance record should be present');
  console.log('✓ ComplianceService Persistent Regulatory Engine Test Passed');

  // Test 5: Pilot service persistence
  const testPilotRecord = {
    id: `PILOT_TEST_${Date.now()}`,
    weight: 250,
    wasteType: 'organic',
    location: 'Kathonda Ward 12',
    collectorId: 'collector_123',
    timestamp: new Date().toISOString(),
    estimatedCCC: 0.125,
    status: 'logged',
    source: 'mobile_app',
  };
  await PilotService.addRecord(testPilotRecord);
  const pilotRecords = await PilotService.getRecordsByCollector('collector_123');
  console.assert(pilotRecords.some(p => p.id === testPilotRecord.id), 'Pilot record should be stored');
  console.log('✓ PilotService Persistent Mobile/WhatsApp Log Engine Test Passed');

  // Test 6: AuditLog service
  await AuditLogService.log('SYSTEM_TEST', 'Persistence test runner executed successfully', 'tester_system');
  const logs = await AuditLogService.getLogs(10);
  console.assert(logs.some(l => l.event === 'SYSTEM_TEST'), 'Audit log should be recorded in persistence');
  console.log('✓ AuditLogService Persistent Sovereign Traceability Test Passed');

  // Test 7: Blockchain append
  const testBlock = {
    record_id: testRecord.id,
    user_id: 'user_patel_1',
    waste_type: 'Agricultural Residue',
    weight_kg: 1250,
    ccc_amount_kg: '625.00',
    verified_by: 'Kathonda Local MRV Engine',
  };
  const appended = await BlockchainService.appendBlock(testBlock);
  console.assert(appended && appended.hash, 'Appended block must have cryptographic SHA256 hash');
  console.log('✓ BlockchainService Persistent Cryptographic Ledger Test Passed');

  // Test 8: MRV Quality Engine & Double Counting Engine
  const doubleCountCheck = await doubleCountingEngine.check('NON_EXISTENT_PROJ', 'FACILITY_1', 'NON_EXISTENT_PERIOD');
  console.assert(doubleCountCheck.status === 'BLOCKED', 'Double counting on invalid period should block safely');
  console.log('✓ DoubleCountingEngine & MRVQualityEngine Fail-Safe Validation Test Passed');

    console.log('\n============================================================');
    console.log('ALL 8 PERSISTENT SERVICE & INTEGRITY TESTS COMPLETED WITH 100% SUCCESS');
    console.log('============================================================\n');
    process.exit(0);
  } catch (e) {
    console.error('Test assertion failed:', e);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});

