import { Router } from 'express';
import { auth } from '../middleware/auth.ts';
import { getCustodyPosition, listAvailablePositions, reservePosition, releaseReservation } from '../services/environmentalCreditRepository.ts';
import { GcpCommercialIntegration } from '../services/gcpCommercialIntegration.ts';
import { assertLifecycleGate, assertCreditIssuerBoundary, type LifecycleGateInput, type LifecycleStage } from '../services/environmentalCreditLifecycle.ts';

export const environmentalCreditsRouter = Router();
environmentalCreditsRouter.use(auth());

function requireIdempotencyKey(req: any): string {
  const key = String(req.get('Idempotency-Key') || req.body?.idempotencyKey || '').trim();
  if (!key || key.length > 200) throw new Error('A valid Idempotency-Key is required');
  return key;
}

async function getPositionOr404(positionId: string) {
  try { return await getCustodyPosition(positionId); } catch { return null; }
}

environmentalCreditsRouter.get('/available', async (req: any, res) => {
  try {
    const type = req.query.creditType === 'CCC' || req.query.creditType === 'GREEN_CREDIT' ? req.query.creditType : undefined;
    res.json(await listAvailablePositions(type));
  } catch { res.status(503).json({ error: 'Environmental credit depository unavailable' }); }
});

environmentalCreditsRouter.get('/lifecycle/order', (_req, res) => {
  res.json({
    lifecycle: ['MRV','METHODOLOGY','ACVA_VERIFICATION','AUTHORITATIVE_ISSUANCE','CUSTODY','MARKETPLACE','BUYER_ELIGIBILITY','AUTHORITATIVE_TRANSFER','RECONCILIATION','SETTLEMENT','RETIREMENT'],
    issuerBoundaries: { CCC: 'BEE_ICM', GREEN_CREDIT: 'GCP_ICFRE' },
    rupayKgRole: 'DEPOSITORY_AND_MARKETPLACE_AFTER_AUTHORITATIVE_ISSUANCE'
  });
});

environmentalCreditsRouter.post('/lifecycle/gate', async (req: any, res) => {
  try {
    const input = req.body as LifecycleGateInput;
    assertLifecycleGate(input, String(req.body?.target) as LifecycleStage);
    if (req.body?.issuer) assertCreditIssuerBoundary(input.creditType, req.body.issuer);
    res.json({ allowed: true, stage: req.body.target });
  } catch (e: any) { res.status(409).json({ allowed: false, error: e.message }); }
});

// Client-originated custody is prohibited. Only a server-side authoritative registry adapter may call the repository.
environmentalCreditsRouter.post('/custody', async (_req: any, res) => res.status(503).json({
  error: 'AUTHORITATIVE_REGISTRY_REQUIRED',
  message: 'Custody recording requires independent authoritative BEE/ICM or GCP/ICFRE verification.'
}));

// GCP marketplace listing is stateful and therefore uses the commercial integration ledger.
environmentalCreditsRouter.post('/:positionId/list', async (req: any, res) => {
  try {
    const position = await getPositionOr404(req.params.positionId);
    if (!position) return res.status(404).json({ error: 'Depository position not found' });
    if (position.authoritative_registry === 'GCP_ICFRE') {
      const result = await new GcpCommercialIntegration().list({ positionId: req.params.positionId, actorUid: req.user.uid, idempotencyKey: requireIdempotencyKey(req) });
      return res.json(result);
    }
    res.status(409).json({ error: 'GCP_LISTING_ROUTE_REQUIRES_GCP_POSITION' });
  } catch (e: any) { res.status(503).json({ error: e.message }); }
});

environmentalCreditsRouter.post('/:positionId/reserve', async (req: any, res) => {
  try {
    const position = await getPositionOr404(req.params.positionId);
    if (!position) return res.status(404).json({ error: 'Depository position not found' });
    const key = requireIdempotencyKey(req);
    if (position.authoritative_registry === 'GCP_ICFRE') {
      return res.json(await new GcpCommercialIntegration().reserve({
        positionId: req.params.positionId, quantity: Number(req.body?.quantity), actorUid: req.user.uid,
        idempotencyKey: key, principalUid: req.user.uid, role: req.user?.role,
      }));
    }
    return res.json(await reservePosition(req.params.positionId, Number(req.body?.quantity), req.user.uid, key, req.user.uid, req.user?.role));
  } catch (e: any) { return res.status(400).json({ error: e.message }); }
});

environmentalCreditsRouter.post('/:positionId/release', async (req: any, res) => {
  try { res.json(await releaseReservation(req.params.positionId, Number(req.body?.quantity), req.user.uid, requireIdempotencyKey(req))); }
  catch (e: any) { res.status(400).json({ error: e.message }); }
});

// All irreversible GCP operations are routed to the server-side authoritative integration.
environmentalCreditsRouter.post('/:positionId/transfer/confirm', async (req: any, res) => {
  try {
    const position = await getPositionOr404(req.params.positionId);
    if (!position) return res.status(404).json({ error: 'Depository position not found' });
    if (position.authoritative_registry !== 'GCP_ICFRE') return res.status(409).json({ error: 'GCP_TRANSFER_ROUTE_REQUIRES_GCP_POSITION' });
    const result = await new GcpCommercialIntegration().transfer({
      positionId: req.params.positionId, quantity: Number(req.body?.quantity), actorUid: req.user.uid,
      idempotencyKey: requireIdempotencyKey(req), buyerEntityId: String(req.body?.buyerEntityId || ''),
    });
    return res.json(result);
  } catch (e: any) { return res.status(503).json({ error: e.message }); }
});

environmentalCreditsRouter.post('/:positionId/reconcile', async (req: any, res) => {
  try {
    const position = await getPositionOr404(req.params.positionId);
    if (!position) return res.status(404).json({ error: 'Depository position not found' });
    if (position.authoritative_registry !== 'GCP_ICFRE') return res.status(409).json({ error: 'GCP_RECONCILIATION_ROUTE_REQUIRES_GCP_POSITION' });
    return res.json(await new GcpCommercialIntegration().reconcile({
      positionId: req.params.positionId, creditReference: position.authoritative_credit_reference,
      buyerEntityId: String(req.body?.buyerEntityId || ''), expectedQuantity: Number(req.body?.expectedQuantity),
    }));
  } catch (e: any) { return res.status(503).json({ error: e.message }); }
});

environmentalCreditsRouter.post('/:positionId/settle', async (req: any, res) => {
  try {
    const position = await getPositionOr404(req.params.positionId);
    if (!position) return res.status(404).json({ error: 'Depository position not found' });
    if (position.authoritative_registry !== 'GCP_ICFRE') return res.status(409).json({ error: 'GCP_SETTLEMENT_ROUTE_REQUIRES_GCP_POSITION' });
    return res.json(await new GcpCommercialIntegration().settleAndRecord({
      positionId: req.params.positionId, actorUid: req.user.uid, idempotencyKey: requireIdempotencyKey(req),
      reservationActive: Boolean(req.body?.reservationActive), authoritativeTransferConfirmed: Boolean(req.body?.authoritativeTransferConfirmed),
      reconciled: Boolean(req.body?.reconciled), tradeValue: Number(req.body?.tradeValue), currency: String(req.body?.currency || ''),
    }));
  } catch (e: any) { return res.status(503).json({ error: e.message }); }
});

environmentalCreditsRouter.post('/:positionId/retire', async (req: any, res) => {
  try {
    const position = await getPositionOr404(req.params.positionId);
    if (!position) return res.status(404).json({ error: 'Depository position not found' });
    if (position.authoritative_registry !== 'GCP_ICFRE') return res.status(409).json({ error: 'GCP_RETIREMENT_ROUTE_REQUIRES_GCP_POSITION' });
    return res.json(await new GcpCommercialIntegration().retire({
      positionId: req.params.positionId, quantity: Number(req.body?.quantity), actorUid: req.user.uid,
      idempotencyKey: requireIdempotencyKey(req), reason: String(req.body?.reason || ''),
    }));
  } catch (e: any) { return res.status(503).json({ error: e.message }); }
});
