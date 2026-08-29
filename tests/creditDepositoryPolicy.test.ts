import { strict as assert } from 'node:assert';
import { acceptAuthoritativeHolding, calculateExistingWaterfall, reserveForSale } from '../src/services/creditDepositoryPolicy';

const proof = {
  creditType: 'CCC' as const,
  registry: 'BEE_ICM' as const,
  registryAccountId: 'RUPAYKG-ICM-ACCOUNT',
  creditReference: 'ICM-CREDIT-001',
  holderEntityId: 'RUPAYKG',
  quantity: 100,
  tradable: true,
  verifiedAt: new Date().toISOString(),
};

const position = acceptAuthoritativeHolding(proof);
assert.equal(position.availableQuantity, 100);
assert.equal(reserveForSale(position, 25).availableQuantity, 75);

assert.throws(() => acceptAuthoritativeHolding({ ...proof, tradable: false }));
assert.throws(() => reserveForSale(position, 101));
assert.throws(() => acceptAuthoritativeHolding({ ...proof, registryAccountId: '' }));

const waterfall = calculateExistingWaterfall(1_000_000);
assert.equal(Math.round(Object.values(waterfall).reduce((a, b) => a + b, 0)), 1_000_000);
assert.equal(waterfall.rupayKgTreasury, 530_000);

console.log('Environmental credit depository policy tests: PASS');
