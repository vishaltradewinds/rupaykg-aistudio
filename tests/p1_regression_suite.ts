import { CqeMethodologyDbService } from '../src/db/cqeMethodologies.ts';
import { HederaAnchorProvider } from '../src/services/hederaAnchor.ts';
import { CredentialService } from '../src/services/credentialService.ts';
import { db } from '../src/db/index.ts';
import { cqe_methodologies, operational_logs } from '../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

interface TestResult {
  testId: string;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function recordTest(testId: string, name: string, passed: boolean, details: string) {
  results.push({ testId, name, passed, details });
  const statusStr = passed ? '✅ PASSED' : '❌ FAILED';
  console.log(`[${statusStr}] [${testId}] ${name} - ${details}`);
}

async function runP1Suite() {
  console.log('===============================================================');
  console.log('RUPAYKG ENTERPRISE 3.0 — P1 REGRESSION & HARDENING VERIFICATION');
  console.log('===============================================================\n');

  const testSuffix = Date.now().toString().slice(-6);
  const testMethodologyCode = `TEST-BM-WA-${testSuffix}`;
  const testMethodologyId = `${testMethodologyCode}-v1.0`;

  // P1-01: Methodology Persistence in PostgreSQL
  try {
    const created = await CqeMethodologyDbService.registerMethodology({
      methodologyId: testMethodologyId,
      methodologyCode: testMethodologyCode,
      title: `Automated Test Organic Waste Anaerobic Digestion ${testSuffix}`,
      sector: "Waste Handling & Disposal",
      version: "1.0",
      status: "ACTIVE",
      baselineRules: "Baseline emissions calculated as open dumping baseline.",
      projectRules: "Project emissions from biogas generation.",
      leakageRules: "Zero boundary leakage.",
      applicability: ["Anaerobic digesters > 5 TPD"],
      monitoringRequirements: ["Daily weighbridge readings", "Methane content > 55%"],
      emissionFactors: [{ name: "Grid EF", code: "EF_GRID", value: 0.716, unit: "tCO2e/MWh", source: "CEA CO2 Baseline" }]
    }, { id: 'admin-001', name: 'Test Auditor', role: 'super_admin' }, 'CUSTOM');

    // Query directly from PostgreSQL via Drizzle
    const dbRow = await db.select().from(cqe_methodologies).where(eq(cqe_methodologies.id, testMethodologyId)).limit(1);
    
    if (dbRow.length === 1 && dbRow[0].id === testMethodologyId && dbRow[0].sourceType === 'CUSTOM') {
      recordTest('P1-01', 'PostgreSQL Authoritative Methodology Persistence', true, `Methodology persisted with ID ${dbRow[0].id} in cqe_methodologies table.`);
    } else {
      recordTest('P1-01', 'PostgreSQL Authoritative Methodology Persistence', false, 'Row not found in cqe_methodologies table.');
    }
  } catch (err: any) {
    recordTest('P1-01', 'PostgreSQL Authoritative Methodology Persistence', false, `Error: ${err.message}`);
  }

  // P1-02: Restart Survival / Independent Fetch Test
  try {
    const retrieved = await CqeMethodologyDbService.getMethodologyById(testMethodologyId);
    if (retrieved && retrieved.methodologyCode === testMethodologyCode && retrieved.sourceType === 'CUSTOM') {
      recordTest('P1-02', 'Restart Survival & Database Query Integrity', true, `Successfully retrieved methodology ${retrieved.methodologyCode} across independent query context.`);
    } else {
      recordTest('P1-02', 'Restart Survival & Database Query Integrity', false, 'Failed to retrieve persisted methodology.');
    }
  } catch (err: any) {
    recordTest('P1-02', 'Restart Survival & Database Query Integrity', false, `Error: ${err.message}`);
  }

  // P1-03: Multi-client / Combined Catalogue Listing Test
  try {
    const all = await CqeMethodologyDbService.getAllMethodologies({ search: testMethodologyCode });
    const found = all.find(m => m.methodologyId === testMethodologyId);
    if (found && all.length >= 1) {
      recordTest('P1-03', 'Unified Catalogue Listing with PostgreSQL Custom Records', true, `Found custom methodology in combined registry catalogue (${all.length} matching).`);
    } else {
      recordTest('P1-03', 'Unified Catalogue Listing with PostgreSQL Custom Records', false, 'Custom methodology missing in catalogue search.');
    }
  } catch (err: any) {
    recordTest('P1-03', 'Unified Catalogue Listing with PostgreSQL Custom Records', false, `Error: ${err.message}`);
  }

  // P1-04: Version Bump & Superseded State in PostgreSQL
  try {
    const bumped = await CqeMethodologyDbService.createNewVersion(
      testMethodologyId,
      '2.0',
      'Updated methane capture efficiency parameters.',
      { title: `Automated Test Organic Waste Anaerobic Digestion ${testSuffix} (v2)` },
      { id: 'admin-001', name: 'Test Auditor', role: 'super_admin' }
    );

    const oldRow = await db.select().from(cqe_methodologies).where(eq(cqe_methodologies.id, testMethodologyId)).limit(1);
    const newRow = await db.select().from(cqe_methodologies).where(eq(cqe_methodologies.id, bumped.newVersion.methodologyId)).limit(1);

    if (oldRow[0]?.status === 'SUPERSEDED' && newRow[0]?.version === '2.0' && newRow[0]?.status === 'ACTIVE') {
      recordTest('P1-04', 'Methodology Versioning & Superseded Lifecycle in PostgreSQL', true, `v1 marked SUPERSEDED with supersededBy=${oldRow[0].supersededBy}; v2 created as ACTIVE.`);
    } else {
      recordTest('P1-04', 'Methodology Versioning & Superseded Lifecycle in PostgreSQL', false, `State mismatch: oldStatus=${oldRow[0]?.status}, newVersion=${newRow[0]?.version}`);
    }
  } catch (err: any) {
    recordTest('P1-04', 'Methodology Versioning & Superseded Lifecycle in PostgreSQL', false, `Error: ${err.message}`);
  }

  // P1-05: Immutable Audit Logging in operational_logs
  try {
    const logs = await db.select().from(operational_logs)
      .where(eq(operational_logs.category, 'CQE_METHODOLOGY_AUDIT'))
      .orderBy(desc(operational_logs.timestamp))
      .limit(10);

    const relatedLog = logs.find(l => (l.metadata as any)?.methodologyId === testMethodologyId || (l.metadata as any)?.after?.id === testMethodologyId);
    if (relatedLog && relatedLog.userId === 'admin-001') {
      recordTest('P1-05', 'Immutable Operational Audit Trail for Methodology Mutations', true, `Audit entry ${relatedLog.id} logged for methodology ${testMethodologyId} by admin-001.`);
    } else {
      recordTest('P1-05', 'Immutable Operational Audit Trail for Methodology Mutations', false, `No audit log found matching methodology mutation.`);
    }
  } catch (err: any) {
    recordTest('P1-05', 'Immutable Operational Audit Trail for Methodology Mutations', false, `Error: ${err.message}`);
  }

  // P1-06: Hedera Read/Write Status Separation (Truthful Reporting)
  try {
    const hederaStatus = HederaAnchorProvider.getAnchorStatus();
    if (hederaStatus.readStatus === 'AVAILABLE' && hederaStatus.writeStatus === 'NOT_AVAILABLE' && hederaStatus.consensusStatus === 'NOT_AVAILABLE') {
      recordTest('P1-06', 'Hedera Read/Write Status Truthful Separation', true, `Read: ${hederaStatus.readStatus}, Write: ${hederaStatus.writeStatus}, Consensus: ${hederaStatus.consensusStatus}. No synthetic TX generated.`);
    } else {
      recordTest('P1-06', 'Hedera Read/Write Status Truthful Separation', false, `Unexpected Hedera status: ${JSON.stringify(hederaStatus)}`);
    }

    const anchorAttempt = await HederaAnchorProvider.submitAnchor({
      eventType: 'TEST_EVENT',
      recordId: 'REC-001',
      weightKg: 1000
    });

    if (anchorAttempt.status === 'NOT_AVAILABLE' && anchorAttempt.transactionId === null && anchorAttempt.isSimulated === false && anchorAttempt.integrityHash.length === 64) {
      recordTest('P1-06b', 'Hedera Fail-Closed Write Attempt Handling', true, `Anchor attempt safely returned NOT_AVAILABLE with local SHA-256 integrity hash (${anchorAttempt.integrityHash.slice(0, 12)}...).`);
    } else {
      recordTest('P1-06b', 'Hedera Fail-Closed Write Attempt Handling', false, `Anchor attempt returned invalid payload: ${JSON.stringify(anchorAttempt)}`);
    }
  } catch (err: any) {
    recordTest('P1-06', 'Hedera Read/Write Status Truthful Separation', false, `Error: ${err.message}`);
  }

  // P1-07: Cryptographic Terminology & Credential Verification Accuracy
  try {
    const cred = CredentialService.issueCredential({
      id: 'did:rupaykg:entity:test-entity',
      claims: { certifiedAvoidanceKg: 4200, standard: 'CCTS OM 2026' }
    });

    if (cred.proofStatus === 'INTEGRITY_HASH_ONLY' && cred.signature === null && cred.isSimulated === false && cred.proofType === 'LOCAL_SHA256_DIGEST') {
      const verify = CredentialService.verifyCredential(cred.verifiableCredential, cred.integrityHash);

      if (verify.isValid && verify.proofStatus === 'INTEGRITY_HASH_ONLY' && verify.signatureVerified === false && verify.guardianPolicyStatus === 'NOT_AVAILABLE') {
        recordTest('P1-07', 'Cryptographic Terminology & Real Credential Digest Proof Boundary', true, 'Digest verified locally; W3C signature and Guardian accurately reported as NOT_AVAILABLE.');
      } else {
        recordTest('P1-07', 'Cryptographic Terminology & Real Credential Digest Proof Boundary', false, `Verification mismatch: ${JSON.stringify(verify)}`);
      }
    } else {
      recordTest('P1-07', 'Cryptographic Terminology & Real Credential Digest Proof Boundary', false, `Issuance proof status invalid: ${JSON.stringify(cred)}`);
    }
  } catch (err: any) {
    recordTest('P1-07', 'Cryptographic Terminology & Real Credential Digest Proof Boundary', false, `Error: ${err.message}`);
  }

  // P1-08: Protection of Official Immutable Reference Standards
  try {
    let failedAsExpected = false;
    try {
      await CqeMethodologyDbService.deleteMethodology('BM-WA03.001-v1.0', { id: 'admin-001' });
    } catch (e: any) {
      failedAsExpected = e.message.includes('System reference methodologies');
    }

    if (failedAsExpected) {
      recordTest('P1-08', 'System Reference Methodology Immutability Guard', true, 'Protected official BEE reference standards against deletion.');
    } else {
      recordTest('P1-08', 'System Reference Methodology Immutability Guard', false, 'Deletion of system reference did not throw expected guard exception.');
    }
  } catch (err: any) {
    recordTest('P1-08', 'System Reference Methodology Immutability Guard', false, `Error: ${err.message}`);
  }

  // Cleanup test methodology
  try {
    await CqeMethodologyDbService.deleteMethodology(testMethodologyId, { id: 'admin-001' });
    await CqeMethodologyDbService.deleteMethodology(`${testMethodologyCode}-v2.0`, { id: 'admin-001' });
  } catch (_) {}

  console.log('\n===============================================================');
  console.log('SUMMARY OF P1 VERIFICATION RESULTS:');
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  console.log(`TOTAL TESTS: ${totalCount} | PASSED: ${passedCount} | FAILED: ${totalCount - passedCount}`);
  console.log('===============================================================\n');

  if (passedCount !== totalCount) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runP1Suite().catch(err => {
  console.error('[P1 Suite Fatal Failure]', err);
  process.exit(1);
});
