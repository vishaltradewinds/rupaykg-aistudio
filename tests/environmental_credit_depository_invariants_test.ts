import { strict as assert } from 'node:assert';
import { acceptAuthoritativeHolding, reserveForSale, calculateExistingWaterfall } from '../src/services/creditDepositoryPolicy';

function test(name: string, fn: () => void) { try { fn(); console.log(`PASS: ${name}`); } catch (e) { console.error(`FAIL: ${name}`); throw e; } }

const base = {
  creditType: 'CCC' as const,
  registry: 'BEE_ICM' as const,
  registryAccountId: 'RUPAYKG-ICM',
  creditReference: 'ICM-001',
  holderEntityId: 'RUPAYKG',
  quantity: 100,
  tradable: true,
  verifiedAt: new Date().toISOString(),
};

test('authoritative holding is required', () => {
  assert.throws(() => acceptAuthoritativeHolding({ ...base, registryAccountId: '' }));
  assert.throws(() => acceptAuthoritativeHolding({ ...base, creditReference: '' }));
  assert.throws(() => acceptAuthoritativeHolding({ ...base, holderEntityId: '' }));
});

test('non-tradable credits cannot enter sale inventory', () => {
  assert.throws(() => acceptAuthoritativeHolding({ ...base, tradable: false }));
});

test('custody quantity cannot be oversold', () => {
  const position = acceptAuthoritativeHolding(base);
  const reserved = reserveForSale(position, 60);
  assert.equal(reserved.availableQuantity, 40);
  assert.equal(reserved.reservedQuantity, 60);
  assert.throws(() => reserveForSale(reserved, 41));
});

test('existing commercial waterfall conserves gross proceeds', () => {
  const a = calculateExistingWaterfall(1_000_000);
  const total = Object.values(a).reduce((s, n) => s + n, 0);
  assert.ok(Math.abs(total - 1_000_000) < 0.01);
  assert.equal(a.rupayKgTreasury, 530_000);
  assert.equal(a.projectOwner, 350_000);
});

console.log('Environmental credit depository invariants: ALL PASS');
