import { Router } from 'express';
import { auth } from '../middleware/auth.ts';
import { createCustodyPosition, listAvailablePositions, reservePosition } from '../services/environmentalCreditRepository.ts';

export const environmentalCreditsRouter = Router();

environmentalCreditsRouter.use(auth());

environmentalCreditsRouter.get('/available', async (req: any, res) => {
  try {
    const type = req.query.creditType === 'CCC' || req.query.creditType === 'GREEN_CREDIT' ? req.query.creditType : undefined;
    res.json(await listAvailablePositions(type));
  } catch (e: any) { res.status(503).json({ error: 'Environmental credit depository unavailable', detail: e.message }); }
});

environmentalCreditsRouter.post('/custody', async (req: any, res) => {
  try {
    const b = req.body || {};
    if (b.holderEntityId !== req.user?.uid && !['super_admin','regulator'].includes(req.user?.role)) return res.status(403).json({ error: 'Holder must be the authenticated entity' });
    const result = await createCustodyPosition({ ...b, actorUid: req.user.uid });
    res.status(201).json(result);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

environmentalCreditsRouter.post('/:positionId/reserve', async (req: any, res) => {
  try {
    const quantity = Number(req.body?.quantity);
    const result = await reservePosition(req.params.positionId, quantity, req.user.uid, String(req.body?.idempotencyKey || ''));
    res.json(result);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});
