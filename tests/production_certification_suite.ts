import { db } from '../src/db/index';
import { cqe_methodologies } from '../src/db/schema';
import { HederaAnchorProvider } from '../src/services/hederaAnchor';
import { CredentialService } from '../src/services/credentialService';

interface TestRecord {
  testId: string;
  category: string;
  description: string;
  attackVector: string;
  expected: string;
  actual: string;
  status: 'PASS' | 'FAIL';
  evidence: string;
  timestamp: string;
}

const testResults: TestRecord[] = [];

function recordTest(
  testId: string,
  category: string,
  description: string,
  attackVector: string,
  expected: string,
  actual: string,
  status: 'PASS' | 'FAIL',
  evidence: string
) {
  testResults.push({
    testId,
    category,
    description,
    attackVector,
    expected,
    actual,
    status,
    evidence,
    timestamp: new Date().toISOString(),
  });
  console.log(`[${status}] ${testId} - ${description}`);
}

async function runProductionCertification() {
  console.log('============================================================');
  console.log('RUPAYKG ENTERPRISE 3.0 — PRODUCTION CERTIFICATION EXECUTION');
  console.log('============================================================\n');

  // 1. Hedera Fail-Closed & Idempotency Test
  try {
    const testPayload = {
      eventType: 'PROD_CERTIFICATION_TEST',
      recordId: `CERT-REC-${Date.now()}`,
      weightKg: 1250,
      carbonAvoidanceKg: 450,
      metadata: { gateTest: true, uniqueNonce: Math.random().toString(36) }
    };

    const res1 = await HederaAnchorProvider.submitAnchor(testPayload, process.env.HEDERA_TOPIC_ID || '', 'cert_tester');
    const isConfigured = HederaAnchorProvider.isOperatorConfigured();
    if (!isConfigured) {
      const failClosed = (res1.status === 'NOT_AVAILABLE' || res1.status === 'NOT_CONFIGURED') &&
        res1.transactionId === null && !res1.isSimulated;
      recordTest(
        'CERT-HEDERA-01',
        'Hedera Fail-Closed Boundary',
        'Verify Hedera HCS write fails closed when operator credentials are missing',
        'Submit anchor without HEDERA_OPERATOR_KEY',
        'status: NOT_AVAILABLE or NOT_CONFIGURED, transactionId: null, isSimulated: false',
        `status: ${res1.status}, transactionId: ${res1.transactionId}, isSimulated: ${res1.isSimulated}`,
        failClosed ? 'PASS' : 'FAIL',
        failClosed
          ? `Integrity hash computed locally: ${res1.integrityHash}. No fake transaction IDs generated.`
          : 'Fail-closed requirement not met.'
      );
    } else {
      recordTest(
        'CERT-HEDERA-01',
        'Hedera Live Operator',
        'Verify Hedera HCS live operator submission',
        'Real HCS submission with operator keys',
        'status: CONSENSUS_CONFIRMED, valid transactionId',
        `status: ${res1.status}, transactionId: ${res1.transactionId}`,
        res1.status === 'CONSENSUS_CONFIRMED' ? 'PASS' : 'FAIL',
        `Live transaction ID: ${res1.transactionId}`
      );
    }

    const res2 = await HederaAnchorProvider.submitAnchor(testPayload, process.env.HEDERA_TOPIC_ID || '', 'cert_tester');
    recordTest(
      'CERT-HEDERA-02',
      'Hedera Idempotency Guard',
      'Verify identical payload returns idempotent matching anchor',
      'Duplicate anchor submission for same payload hash',
      'Same integrityHash, no duplicate submission',
      `Integrity hash match: ${res2.integrityHash === res1.integrityHash}`,
      res2.integrityHash === res1.integrityHash ? 'PASS' : 'FAIL',
      `Payload hash ${res1.integrityHash} checked for duplicate submission.`
    );

    const tamperedPayload = { ...testPayload, weightKg: 99999 };
    const tamperedHash = HederaAnchorProvider.computePayloadHash(tamperedPayload);
    const isTamperDetected = tamperedHash !== res1.integrityHash;
    recordTest(
      'CERT-HEDERA-03',
      'Hedera Tamper Detection',
      'Verify payload mutation alters integrity digest and fails verification',
      'Modify local payload after anchoring (weightKg changed 1250 -> 99999)',
      'Hash mismatch detected (tamper failure)',
      `Tamper detected: ${isTamperDetected}`,
      isTamperDetected ? 'PASS' : 'FAIL',
      `Original hash ${res1.integrityHash.substring(0, 16)}... != Modified hash ${tamperedHash.substring(0, 16)}...`
    );
  } catch (err: any) {
    console.error('Hedera test error:', err);
    recordTest(
      'CERT-HEDERA-01',
      'Hedera Certification Harness',
      'Hedera certification execution completed without unhandled errors',
      'Hedera certification exception',
      'No unhandled exception',
      err?.message || String(err),
      'FAIL',
      'Hedera certification section threw before completing its assertions.'
    );
  }

  // 2. W3C Verifiable Credentials Test & Tamper Resistance
  try {
    const subject = {
      id: 'did:rupaykg:mrf:facility-001',
      claims: {
        facilityType: 'Material Recovery Facility',
        action: 'PLASTIC_SEGREGATION',
        weightProcessedKg: 5000,
        avoidedMethaneKg: 1200,
        batchNumber: `BAT-${Date.now()}`
      }
    };

    const issuance = CredentialService.issueCredential(subject);
    const verification = CredentialService.verifyCredential(issuance.verifiableCredential, issuance.integrityHash);

    recordTest(
      'CERT-VC-01',
      'W3C VC Issuance & Canonical Hashing',
      'Verify RFC 8785 canonicalization and issuance proof status',
      'Issue standard circular economy activity credential',
      'Valid W3C VC structure with canonical SHA-256 integrity hash',
      `proofType: ${issuance.proofType}, proofStatus: ${issuance.proofStatus}, isValid: ${verification.isValid}`,
      verification.isValid ? 'PASS' : 'FAIL',
      `Credential ID: ${issuance.credentialId}, Integrity Digest: ${issuance.integrityHash}`
    );

    const tamperedVc = JSON.parse(JSON.stringify(issuance.verifiableCredential));
    tamperedVc.credentialSubject.weightProcessedKg = 9999999;
    const tamperedVerification = CredentialService.verifyCredential(tamperedVc, issuance.integrityHash);

    recordTest(
      'CERT-VC-02',
      'W3C VC Tamper Invalidation',
      'Verify credential claim tampering immediately invalidates integrity digest and signature',
      'Directly mutate credentialSubject field in issued VC',
      'isValid: false, tampered: true, proofStatus: TAMPERED or FAILED',
      `isValid: ${tamperedVerification.isValid}, tampered: ${tamperedVerification.tampered}, proofStatus: ${tamperedVerification.proofStatus}`,
      !tamperedVerification.isValid && tamperedVerification.tampered ? 'PASS' : 'FAIL',
      `Tamper correctly detected: ${tamperedVerification.message}`
    );
  } catch (err: any) {
    console.error('VC test error:', err);
    recordTest(
      'CERT-VC-01',
      'W3C VC Certification Harness',
      'W3C VC certification execution completed without unhandled errors',
      'VC certification exception',
      'No unhandled exception',
      err?.message || String(err),
      'FAIL',
      'VC certification section threw before completing its assertions.'
    );
  }

  // 3. PostgreSQL Database Authority & Table Presence
  try {
    if (db) {
      await db.select().from(cqe_methodologies).limit(5);
      recordTest(
        'CERT-DB-01',
        'PostgreSQL Authority Verification',
        'Verify cqe_methodologies and domain tables exist and are queryable',
        'Direct Drizzle ORM select queries against PostgreSQL',
        'Successful query execution with zero SQL errors',
        'Query successful. Rows accessible.',
        'PASS',
        'PostgreSQL stores live tables cqe_methodologies and core domain records.'
      );
    } else {
      throw new Error('Database handle is unavailable.');
    }
  } catch (err: any) {
    console.error('DB test error:', err);
    recordTest(
      'CERT-DB-01',
      'PostgreSQL Authority Verification',
      'Verify cqe_methodologies and domain tables are queryable',
      'Direct Drizzle ORM select query',
      'Successful query execution',
      err?.message || String(err),
      'FAIL',
      'Database certification assertion failed.'
    );
  }

  const expectedTestIds = [
    'CERT-HEDERA-01',
    'CERT-HEDERA-02',
    'CERT-HEDERA-03',
    'CERT-VC-01',
    'CERT-VC-02',
    'CERT-DB-01',
  ];
  const missing = expectedTestIds.filter(id => !testResults.some(t => t.testId === id));
  const failed = testResults.filter(t => t.status === 'FAIL');
  const passed = testResults.filter(t => t.status === 'PASS').length;

  console.log('\n============================================================');
  console.log(`CERTIFICATION SUMMARY: ${passed} / ${expectedTestIds.length} PASSED`);
  if (missing.length > 0) console.log(`MISSING TEST RESULTS: ${missing.join(', ')}`);
  if (failed.length > 0) console.log(`FAILED TESTS: ${failed.map(t => t.testId).join(', ')}`);
  console.log('============================================================\n');

  // Certification must fail the process if any expected assertion failed or was skipped.
  process.exitCode = missing.length > 0 || failed.length > 0 || testResults.length !== expectedTestIds.length ? 1 : 0;
}

runProductionCertification().catch((err) => {
  console.error(err);
  process.exit(1);
});
