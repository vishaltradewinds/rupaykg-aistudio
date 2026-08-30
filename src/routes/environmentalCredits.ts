import { Router } from 'express';
import { auth } from '../middleware/auth.ts';
import { listAvailablePositions, reservePosition, releaseReservation, retireCredits } from '../services/environmentalCreditRepository.ts';
import { assertLifecycleGate, assertCreditIssuerBoundary, type LifecycleGateInput, type LifecycleStage } from '../services/environmentalCreditLifecycle.ts';

export const environmentalCreditsRouter = Router();
environmentalCreditsRouter.use(auth());

function requireIdempotencyKey(req: any): string {
  const key = String(req.get('Idempotency-Key') || req.body?.idempotencyKey || '').trim();
  if (!key || key.length > 200) throw new Error('A valid Idempotency-Key is required');
  return key;
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
  } catch (e: any) {
    res.status(409).json({ allowed: false, error: e.message });
  }
});

// Client-originated custody is prohibited. Only a server-side authoritative registry adapter may call the repository.
environmentalCreditsRouter.post('/custody', async (_req: any, res) => res.status(503).json({
  error: 'AUTHORITATIVE_REGISTRY_REQUIRED',
  message: 'Custody recording requires independent authoritative BEE/ICM or GCP/ICFRE verification.'
}));

environmentalCreditsRouter.post('/:positionId/reserve', async (req: any, res) => {
  try {
    const result = await reservePosition(req.params.positionId, Number(req.body?.quantity), req.user.uid, requireIdempotencyKey(req), req.user.uid, req.user?.role);
    res.json(result);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

environmentalCreditsRouter.post('/:positionId/release', async (req: any, res) => {
  try {
    res.json(await releaseReservation(req.params.positionId, Number(req.body?.quantity), req.user.uid, requireIdempotencyKey(req)));
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

environmentalCreditsRouter.post('/:positionId/retire', async (req: any, res) => {
  try {
    res.json(await retireCredits(
      req.params.positionId,
      Number(req.body?.quantity),
      req.user.uid,
      requireIdempotencyKey(req),
      String(req.body?.reason || ''),
      String(req.body?.authoritativeRetirementReference || '')
    ));
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Public callers cannot attest to an authoritative transfer or buyer eligibility.
// The authoritative registry adapter must perform those checks server-side and call the repository directly.
environmentalCreditsRouter.post('/:positionId/transfer/confirm', async (_req: any, res) => res.status(503).json({
  error: 'AUTHORITATIVE_TRANSFER_ADAPTER_REQUIRED',
  message: 'Transfer confirmation is restricted to the server-side authoritative registry adapter; client-supplied transfer or eligibility flags are never trusted.'
}));