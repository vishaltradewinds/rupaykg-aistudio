import { Router } from 'express';
import { listAvailablePositions, reservePosition } from '../services/environmentalCreditRepository.ts';

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
  } catch (e: any) { res.status(503).json({ error: 'Environmental credit depository unavailable' }); }
});

// Direct HTTP custody creation is intentionally disabled. A custody position is
// valid only after a server-side authoritative BEE/ICM or GCP/ICFRE adapter has
// independently verified issuance, holder and tradability. Client-supplied
// registry references must never be treated as authoritative proof.
environmentalCreditsRouter.post('/custody', async (_req: any, res) => {
  return res.status(503).json({
    error: 'AUTHORITATIVE_REGISTRY_REQUIRED',
    message: 'Custody recording is unavailable until the applicable authoritative registry adapter is configured and verifies the holding.',
  });
});

environmentalCreditsRouter.post('/:positionId/reserve', async (req: any, res) => {
  try {
    const quantity = Number(req.body?.quantity);
    const idempotencyKey = requireIdempotencyKey(req);
    const result = await reservePosition(req.params.positionId, quantity, req.user.uid, idempotencyKey, req.user.uid, req.user?.role);
    res.json(result);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});
