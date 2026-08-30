import assert from 'node:assert/strict';
import {
  BEE_CCTS_APPROVED,
  GCP_APPROVED,
  FUTURE_OR_REFERENCE_PATHWAYS,
  getIssuanceEligibleMethodologies,
  getMethodology,
} from '../src/services/indiaMethodologyCatalog.ts';

assert.equal(BEE_CCTS_APPROVED.length, 8, 'Current BEE CCTS Offset catalogue should contain 8 approved methodologies');
assert.equal(GCP_APPROVED.length, 1, 'Current notified GCP methodology should be represented');
assert.ok(FUTURE_OR_REFERENCE_PATHWAYS.length >= 1, 'Future/reference GCP pathways must be explicitly separated');

for (const method of BEE_CCTS_APPROVED) {
  assert.equal(method.authority, 'BEE_ICM');
  assert.equal(method.status, 'APPROVED');
  assert.equal(method.creditOutcome, 'CCC');
  assert.equal(method.acvaRequired, true);
}

for (const method of GCP_APPROVED) {
  assert.equal(method.authority, 'GCP_ICFRE');
  assert.equal(method.status, 'APPROVED');
  assert.equal(method.creditOutcome, 'GREEN_CREDIT');
}

for (const method of FUTURE_OR_REFERENCE_PATHWAYS) {
  assert.notEqual(method.status, 'APPROVED', `${method.code} must not be treated as issuance eligible`);
}

assert.equal(getMethodology('BM WA03.001')?.creditOutcome, 'CCC');
assert.equal(getMethodology('GCP-TREE-PLANTATION-2024')?.creditOutcome, 'GREEN_CREDIT');
assert.equal(getMethodology('GCP-WASTE-MANAGEMENT')?.status, 'NOT_YET_APPROVED');
assert.equal(getIssuanceEligibleMethodologies().length, 9);

console.log('India methodology catalog boundary tests: PASS');
