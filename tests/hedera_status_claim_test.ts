import assert from 'node:assert/strict';

async function run() {
  process.env.HEDERA_OPERATOR_ID = '0.0.12345';
  process.env.HEDERA_OPERATOR_KEY = '302e020100300506032b657004220420' + 'a'.repeat(40);
  process.env.HEDERA_TOPIC_ID = '0.0.67890';
  process.env.HEDERA_NETWORK = 'testnet';

  const { HederaAnchorProvider } = await import('../src/services/hederaAnchor.ts');
  const status = HederaAnchorProvider.getAnchorStatus();

  assert.equal(status.isConfigured, true, 'valid-looking runtime configuration should be reported as configured');
  assert.equal(status.consensusStatus, 'CONFIGURED', 'configuration must not be mislabeled as consensus confirmation');
  assert.match(status.message || '', /not proof of a confirmed anchor/i);
  assert.match(status.message || '', /consensus timestamp/i);
  assert.doesNotMatch(status.message || '', /Live anchoring active/i);

  console.log('PASS: Hedera configuration is not represented as proof of confirmed consensus.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
