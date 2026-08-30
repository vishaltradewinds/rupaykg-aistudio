import { Router } from 'express';
import { auth } from '../middleware/auth.ts';
import { listAvailablePositions, reservePosition, releaseReservation } from '../services/environmentalCreditRepository.ts';
import { assertLifecycleGate, assertCreditIssuerBoundary, type LifecycleGateInput, type LifecycleStage } from '../services/environmentalCreditLifecycle.ts';

export const environmentalCreditsRouter = Router();
environmentalCreditsRouter.use(auth());

function requireIdempotencyKey(req: any): string {
  const key = String(req.get('Idempotency-Key') || req.body?.idempotencyKey || '').trim();
  if (!key || key.length > 200) throw new Error('A valid Idempotency-Key is required');
  return key;
}

environmentalCreditsRouter.get('/available', async (req: any, res) => {
  try { res.json(await listAvailablePositions(req.query?.creditType)); }
  catch (e: any) { res.status(400).json({ error: e.message }); }
});

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

// Public callers cannot attest to authoritative retirement. Retirement must be
// initiated by the server-side programme adapter after authoritative confirmation.
environmentalCreditsRouter.post('/:positionId/retire', async (_req: any, res) => res.status(503).json({
  error: 'AUTHORITATIVE_RETIREMENT_ADAPTER_REQUIRED',
  message: 'Retirement is restricted to the server-side authoritative registry adapter; client-supplied retirement evidence is never trusted.'
}));

// Public callers cannot attest to an authoritative transfer or buyer eligibility.
// The authoritative registry adapter must perform those checks server-side and call the repository directly.
environmentalCreditsRouter.post('/:positionId/transfer/confirm', async (_req: any, res) => res.status(503).json({
  error: 'AUTHORITATIVE_TRANSFER_ADAPTER_REQUIRED',
  message: 'Transfer confirmation is restricted to the server-side authoritative registry adapter; client-supplied transfer or eligibility flags are never trusted.'
}));
