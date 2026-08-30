import { Router } from 'express';
import { auth } from '../middleware/auth.ts';
import { createCustodyPosition, listAvailablePositions, reservePosition } from '../services/environmentalCreditRepository.ts';

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

environmentalCreditsRouter.post('/custody', async (req: any, res) => {
  try {
    const b = req.body || {};
    const idempotencyKey = requireIdempotencyKey(req);
    if (b.holderEntityId !== req.user?.uid && !['super_admin','regulator'].includes(req.user?.role)) return res.status(403).json({ error: 'Holder must be the authenticated entity' });
    const result = await createCustodyPosition({ ...b, idempotencyKey, actorUid: req.user.uid });
    res.status(201).json(result);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

environmentalCreditsRouter.post('/:positionId/reserve', async (req: any, res) => {
  try {
    const quantity = Number(req.body?.quantity);
    const idempotencyKey = requireIdempotencyKey(req);
    const result = await reservePosition(req.params.positionId, quantity, req.user.uid, idempotencyKey, req.user.uid, req.user?.role);
    res.json(result);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});
