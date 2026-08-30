import { Router } from 'express';
import { auth } from '../middleware/auth.ts';
import { listAvailablePositions, reservePosition, releaseReservation, retireCredits, confirmAuthoritativeTransfer } from '../services/environmentalCreditRepository.ts';

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
    res.json(await retireCredits(req.params.positionId, Number(req.body?.quantity), req.user.uid, requireIdempotencyKey(req), String(req.body?.reason || '')));
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

// Completion requires a transfer reference produced by the authoritative registry adapter.
environmentalCreditsRouter.post('/:positionId/transfer/confirm', async (req: any, res) => {
  try {
    const body = req.body || {};
    if (body.authoritativeTransferConfirmed !== true) return res.status(503).json({ error: 'AUTHORITATIVE_TRANSFER_REQUIRED', message: 'Authoritative registry transfer confirmation is required.' });
    res.json(await confirmAuthoritativeTransfer({
      positionId: req.params.positionId,
      quantity: Number(body.quantity),
      actorUid: req.user.uid,
      idempotencyKey: requireIdempotencyKey(req),
      buyerEntityId: String(body.buyerEntityId || ''),
      authoritativeTransactionReference: String(body.authoritativeTransactionReference || ''),
      buyerEligibilityVerified: body.buyerEligibilityVerified === true,
    }));
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});
