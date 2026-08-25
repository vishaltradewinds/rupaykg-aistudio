import { RecordService } from '../src/services/recordService.ts';
import { FarmerService } from '../src/services/farmerService.ts';
import { CarbonEventService } from '../src/services/carbonEventService.ts';
import { ComplianceService } from '../src/services/complianceService.ts';
import { PilotService } from '../src/services/pilotService.ts';
import { carbonCalculationEngine, doubleCountingEngine } from '../src/services/carbonOsService.ts';
import { db } from '../src/db/index.ts';
import { records } from '../src/db/schema.ts';

async function testFailClosedBehavior() {
  console.log("=== VERIFYING FAIL-CLOSED PERSISTENCE & ERROR ENFORCEMENT ===");

  // 1. Attempt invalid record with non-nullable constraint violation (null waste_type or missing fields)
  let failedAsExpected = false;
  try {
    // @ts-ignore
    await db.insert(records).values({
      id: "invalid_record_no_waste_type",
      // wasteType is NOT NULL in schema
      wasteType: null,
      weightKg: 100,
      userId: "test_user"
    });
  } catch (err: any) {
    failedAsExpected = true;
    console.log("✓ Constraint violation properly throws without being swallowed:", err.message.substring(0, 80));
  }

  if (!failedAsExpected) {
    throw new Error("FAIL: Invalid database write did not fail closed!");
  }

  // 2. Double counting engine blocks duplicate issuance or missing period
  const doubleCountingRes = await doubleCountingEngine.check("project_1", "fac_1", "non_existent_period");
  if (doubleCountingRes.status === 'BLOCKED') {
    console.log("✓ Double counting engine actively blocks unverified/missing monitoring periods:", doubleCountingRes.reason);
  } else {
    throw new Error("FAIL: Double counting engine failed to block unverified monitoring period");
  }

  console.log("=======================================================");
  console.log("✓ ALL FAIL-CLOSED ENFORCEMENTS VERIFIED");
  console.log("=======================================================");
  process.exit(0);
}

testFailClosedBehavior().catch(err => {
  console.error("FAIL-CLOSED TEST FAILURE:", err);
  process.exit(1);
});
