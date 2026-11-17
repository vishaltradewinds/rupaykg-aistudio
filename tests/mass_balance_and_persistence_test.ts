import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { db, withDbRetry } from '../src/db/index.ts';
import { operational_logs, compliance_records, records as dbRecords } from '../src/db/schema.ts';
import { eq } from 'drizzle-orm';
import { OperationalStore } from '../src/services/operationalStore.ts';
import { MassBalanceService, MassBalanceViolationError } from '../src/services/massBalanceService.ts';

async function runTests() {
  console.log('===================================================================');
  console.log('MASS BALANCE CONSERVATION & POSTGRESQL PERSISTENCE REGRESSION SUITE');
  console.log('===================================================================\n');

  if (!db) {
    throw new Error('PostgreSQL connection unavailable. Set SQL_* / DATABASE_URL before running tests.');
  }

  const testSuffix = crypto.randomBytes(4).toString('hex');
  const testFacilityId = `TEST_FAC_${testSuffix}`;
  const wbLogId = `TEST_WB_${testSuffix}`;
  const procRecId = `TEST_REC_${testSuffix}`;
  const genId = `TEST_GEN_${testSuffix}`;
  const logId = `TEST_CPCB_${testSuffix}`;
  const bondId = `TEST_BOND_${testSuffix}`;
  const createdClaimIds: string[] = [];

  try {
    // 1. OperationalStore PostgreSQL Persistence Round-Trip
    console.log('1. Testing OperationalStore PostgreSQL persistence...');
    await OperationalStore.upsert(
      'GENERATOR_PROFILE',
      genId,
      {
        id: genId,
        legal_name: 'Test BWG Facility Ltd',
        facility_type: 'mrf',
        recurring_volume_estimate: 5000,
      },
      { entityId: genId, status: 'ACTIVE', targetQuantity: 5000 }
    );
    const fetchedGen = await OperationalStore.getById('GENERATOR_PROFILE', genId);
    assert.ok(fetchedGen, 'Generator profile must persist and load from PostgreSQL');
    assert.equal(fetchedGen.legal_name, 'Test BWG Facility Ltd');

    await OperationalStore.upsert(
      'CPCB_BWG_LOG',
      logId,
      {
        id: logId,
        stream: 'DRY_RECYCLABLE',
        weightKg: 320,
        destinationFacility: testFacilityId,
      },
      { entityId: testFacilityId, status: 'VERIFIED', achievedQuantity: 320 }
    );
    const fetchedCpcb = await OperationalStore.listByType('CPCB_BWG_LOG', testFacilityId);
    assert.ok(fetchedCpcb.some((l: any) => l.id === logId), 'CPCB BWG log must persist in PostgreSQL');

    await OperationalStore.upsert(
      'GREEN_BOND',
      bondId,
      {
        id: bondId,
        project_id: testFacilityId,
        title: 'Test Green Bond',
        target_amount: 1000000,
        raised_amount: 0,
      },
      { entityId: testFacilityId, status: 'active', targetQuantity: 1000000 }
    );
    const fetchedBond = await OperationalStore.getById('GREEN_BOND', bondId);
    assert.equal(fetchedBond?.title, 'Test Green Bond');
    console.log('   PASS: OperationalStore persists GENERATOR_PROFILE, CPCB_BWG_LOG, and GREEN_BOND to PostgreSQL.');

    // 2. Physical Mass Balance Conservation — Reject Claim on Zero Intake
    console.log('2. Testing Physical Mass Balance reject on zero verified inward intake...');
    let rejectedZero = false;
    try {
      await MassBalanceService.assertAndRecordOutwardClaim({
        facilityId: testFacilityId,
        requestedOutwardKg: 100,
        outputType: 'RDF_PELLETS',
        claimCategory: 'PROCESSING_OUTPUT',
        actorId: 'test_auditor',
      });
    } catch (err: any) {
      assert.ok(err instanceof MassBalanceViolationError, 'Expected MassBalanceViolationError');
      assert.equal(err.statusCode, 422);
      assert.equal(err.code, 'MASS_BALANCE_VIOLATION');
      rejectedZero = true;
    }
    assert.ok(rejectedZero, 'Zero-intake outward claim must fail with 422 MASS_BALANCE_VIOLATION');
    console.log('   PASS: Outward claim with 0 inward tonnage blocked with 422 MASS_BALANCE_VIOLATION.');

    // 3. Seed Verified Inward Weighbridge Ticket + Processed Batch & Verify Conservation Math
    console.log('3. Testing Physical Mass Balance allow <= inward and reject > remaining...');
    await withDbRetry(() =>
      db.insert(operational_logs).values({
        id: wbLogId,
        level: 'INFO',
        category: 'SWM_WEIGHBRIDGE_TICKET',
        message: `Test inward weighbridge ticket for ${testFacilityId}`,
        userId: 'test_operator',
        metadata: {
          facilityId: testFacilityId,
          grossWeightKg: 1200,
          tareWeightKg: 600,
          netWeightKg: 600,
          vehicleNo: 'MH-01-TEST-01',
        },
      })
    );

    await withDbRetry(() =>
      db.insert(dbRecords).values({
        id: procRecId,
        userId: 'admin_super_1',
        wasteType: 'DRY_PLASTIC',
        weightKg: 400,
        status: 'processed',
        mrvStatus: 'verified',
        evidenceUrls: { processor_id: testFacilityId },
      })
    );

    const allowed = await MassBalanceService.assertAndRecordOutwardClaim({
      facilityId: testFacilityId,
      requestedOutwardKg: 600,
      outputType: 'RECYCLED_PET_FLAKES',
      claimCategory: 'PROCESSING_OUTPUT',
      actorId: 'test_auditor',
    });
    createdClaimIds.push(allowed.claim.id);
    assert.equal(allowed.massBalance.verifiedInwardKg, 1000);
    assert.equal(allowed.massBalance.claimedOutputKg, 600);
    assert.equal(allowed.massBalance.remainingAvailableKg, 400);

    let rejectedOverclaim = false;
    try {
      await MassBalanceService.assertAndRecordOutwardClaim({
        facilityId: testFacilityId,
        requestedOutwardKg: 450, // 600 + 450 = 1050 > 1000
        outputType: 'RECYCLED_PET_FLAKES',
        claimCategory: 'PROCESSING_OUTPUT',
        actorId: 'test_auditor',
      });
    } catch (err: any) {
      assert.ok(err instanceof MassBalanceViolationError);
      assert.equal(err.statusCode, 422);
      rejectedOverclaim = true;
    }
    assert.ok(rejectedOverclaim, 'Cumulative over-claim (1050kg vs 1000kg) must be rejected');

    // Verify MASS_BALANCE_ANOMALY audit log exists
    const anomalies = await withDbRetry(() =>
      db
        .select()
        .from(operational_logs)
        .where(eq(operational_logs.category, 'MASS_BALANCE_ANOMALY'))
    );
    assert.ok(
      anomalies.some((a: any) => String(a.message).includes(testFacilityId)),
      'MASS_BALANCE_ANOMALY audit log must be persisted'
    );
    console.log('   PASS: Conservation boundary enforced (600kg allowed <= 1000kg; 600+450kg blocked + anomaly logged).');

    console.log('\nALL MASS BALANCE & PERSISTENCE REGRESSION TESTS PASSED.');
  } finally {
    try {
      await db.delete(operational_logs).where(eq(operational_logs.id, wbLogId));
      await db.delete(dbRecords).where(eq(dbRecords.id, procRecId));
      for (const id of [genId, logId, bondId, ...createdClaimIds]) {
        await db.delete(compliance_records).where(eq(compliance_records.id, id));
      }
      await db.delete(operational_logs).where(eq(operational_logs.userId, 'test_auditor'));
    } catch (cleanupErr: any) {
      console.warn('Test cleanup notice:', cleanupErr?.message);
    }
  }
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('TEST FAILURE:', err);
    process.exit(1);
  });
