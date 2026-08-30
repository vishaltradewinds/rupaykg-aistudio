import crypto from 'crypto';
import { GcpCommercialIntegration } from '../src/services/gcpCommercialIntegration.ts';
import { GcpSandboxContractAdapter } from '../src/services/gcpSandboxContractAdapter.ts';
import { getCustodyPosition } from '../src/services/environmentalCreditRepository.ts';
import { getGcpCommercialLifecycleEvents, verifyGcpCommercialLifecycleAudit } from '../src/services/gcpCommercialLifecycleLedger.ts';

const quantity = 100;
const transferQuantity = 40;
const seller = `gcp-seller-${crypto.randomUUID()}`;
const buyer = `gcp-buyer-${crypto.randomUUID()}`;
const creditReference = `GCP-SANDBOX-CREDIT:${crypto.randomUUID()}`;
const actor = `test-actor-${crypto.randomUUID()}`;

const registry = new GcpSandboxContractAdapter({
  creditReference,
  registryAccountId: 'GCP-SANDBOX-ACCOUNT-001',
  holderEntityId: seller,
  quantity,
  eligibleBuyers: [buyer],
});
const integration = new GcpCommercialIntegration(registry);

const admitted = await integration.admitCustody({
  registryAccountId: 'GCP-SANDBOX-ACCOUNT-001',
  authoritativeCreditReference: creditReference,
  holderEntityId: seller,
  quantity,
  authoritativeVerifiedAt: new Date().toISOString(),
  actorUid: actor,
  idempotencyKey: `sandbox:admit:${creditReference}`,
});
const sourcePositionId = admitted.positionId;
await integration.list({ positionId: sourcePositionId, actorUid: actor, idempotencyKey: `sandbox:list:${sourcePositionId}` });
await integration.reserve({ positionId: sourcePositionId, quantity: transferQuantity, actorUid: actor, idempotencyKey: `sandbox:reserve:${sourcePositionId}`, principalUid: buyer, role: 'BUYER' });
const transferred = await integration.transfer({ positionId: sourcePositionId, quantity: transferQuantity, actorUid: actor, idempotencyKey: `sandbox:transfer:${sourcePositionId}`, buyerEntityId: buyer });
const buyerPositionId = String((transferred.confirmation as any).custodyTransfer?.buyerPositionId || '');
if (!buyerPositionId) throw new Error('SANDBOX_BUYER_POSITION_NOT_CREATED');

const sourceAfterTransfer: any = await getCustodyPosition(sourcePositionId);
const buyerAfterTransfer: any = await getCustodyPosition(buyerPositionId);
if (Number(sourceAfterTransfer.available_quantity) !== 60) throw new Error(`SANDBOX_SOURCE_AVAILABLE_CONSERVATION_FAILED:${sourceAfterTransfer.available_quantity}`);
if (Number(sourceAfterTransfer.reserved_quantity) !== 0) throw new Error(`SANDBOX_SOURCE_RESERVED_NOT_ZERO:${sourceAfterTransfer.reserved_quantity}`);
if (Number(buyerAfterTransfer.available_quantity) !== transferQuantity) throw new Error(`SANDBOX_BUYER_AVAILABLE_FAILED:${buyerAfterTransfer.available_quantity}`);

await integration.reconcile({ positionId: buyerPositionId, creditReference, buyerEntityId: buyer, expectedQuantity: transferQuantity });
await integration.settleAndRecord({ positionId: buyerPositionId, actorUid: actor, idempotencyKey: `sandbox:settle:${buyerPositionId}`, tradeValue: 4000.005, currency: 'INR', reservationActive: true, authoritativeTransferConfirmed: true, reconciled: true });
await integration.retire({ positionId: buyerPositionId, quantity: transferQuantity, actorUid: actor, idempotencyKey: `sandbox:retire:${buyerPositionId}`, reason: 'SANDBOX_E2E_RETIREMENT' });

const source: any = await getCustodyPosition(sourcePositionId);
const buyerFinal: any = await getCustodyPosition(buyerPositionId);
const conserved = Number(source.available_quantity) + Number(source.reserved_quantity) + Number(buyerFinal.available_quantity) + Number(buyerFinal.reserved_quantity) + Number(buyerFinal.retired_quantity);
if (conserved !== quantity) throw new Error(`SANDBOX_CONSERVATION_INVARIANT_FAILED:${conserved}`);
if (Number(buyerFinal.retired_quantity) !== transferQuantity || buyerFinal.status !== 'RETIRED') throw new Error('SANDBOX_BUYER_RETIREMENT_FAILED');

const sourceAudit = await verifyGcpCommercialLifecycleAudit(sourcePositionId);
const buyerAudit = await verifyGcpCommercialLifecycleAudit(buyerPositionId);
if (!sourceAudit.valid || sourceAudit.finalState !== 'TRANSFER_CONFIRMED') throw new Error('SANDBOX_SOURCE_AUDIT_INVALID');
if (!buyerAudit.valid || buyerAudit.finalState !== 'RETIRED') throw new Error('SANDBOX_BUYER_AUDIT_INVALID');
const buyerEvents = await getGcpCommercialLifecycleEvents(buyerPositionId);
if (buyerEvents.length !== 4) throw new Error(`SANDBOX_BUYER_EVENT_COUNT_FAILED:${buyerEvents.length}`);
if (buyerEvents[0].metadata?.continuationOfPositionId !== sourcePositionId) throw new Error('SANDBOX_BUYER_LINEAGE_MISSING');
if (!buyerEvents.every((event) => event.authoritativeReference || event.toState === 'SETTLED')) throw new Error('SANDBOX_AUDIT_AUTHORITATIVE_REFERENCE_MISSING');

let blocked = false;
try { await integration.transfer({ positionId: buyerPositionId, quantity: 1, actorUid: actor, idempotencyKey: `sandbox:invalid-transfer:${buyerPositionId}`, buyerEntityId: buyer }); } catch { blocked = true; }
if (!blocked) throw new Error('SANDBOX_POST_TRANSFER_MUTATION_NOT_BLOCKED');

console.log('GCP SANDBOX CONTRACT E2E + CONSERVATION + IMMUTABLE AUDIT + ADVERSARIAL TEST: PASSED');
