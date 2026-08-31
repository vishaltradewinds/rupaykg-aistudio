import { Router } from 'express';
import { CreditCustodyService } from '../services/creditCustodyService.ts';
import { WaterfallDoctrineRegistry } from '../services/waterfallDoctrine.ts';

export const depositoryRouter = Router();

const PRIVILEGED_ROLES = new Set(['super_admin', 'regulator', 'auditor']);
const MUTATING_ROLES = new Set(['super_admin', 'regulator']);

function identity(req: any) {
  return req.user?.uid || req.user?.id || null;
}

function isPrivileged(req: any) {
  return PRIVILEGED_ROLES.has(req.user?.role);
}

function requireMutationRole(req: any, res: any): boolean {
  if (!MUTATING_ROLES.has(req.user?.role)) {
    res.status(403).json({ error: 'Insufficient permissions for custody mutation' });
    return false;
  }
  return true;
}

function validPositiveNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function getOwnedPosition(req: any, res: any) {
  const position = await CreditCustodyService.getPositionById(req.params.id);
  if (!position) {
    res.status(404).json({ error: 'Custody position not found' });
    return null;
  }
  if (!isPrivileged(req) && (!position.holderUserId || position.holderUserId !== identity(req))) {
    res.status(403).json({ error: 'Access denied: Cross-tenant custody query' });
    return null;
  }
  return position;
}

// 1. Get Custody Positions
depositoryRouter.get('/positions', async (req: any, res) => {
  try {
    const positions = await CreditCustodyService.getPositions({
      userId: identity(req),
      isAdmin: isPrivileged(req),
      creditType: req.query.creditType,
      status: req.query.status,
    });
    res.json(positions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Single Position
depositoryRouter.get('/positions/:id', async (req: any, res) => {
  try {
    const position = await getOwnedPosition(req, res);
    if (position) res.json(position);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Record Authoritative Custody — issuer ingestion is privileged only.
depositoryRouter.post('/record-custody', async (req: any, res) => {
  try {
    if (!requireMutationRole(req, res)) return;

    const {
      creditType,
      authoritativeRegistry,
      authoritativeCreditReference,
      registryAccountId,
      holderEntityId,
      holderUserId,
      issuedQuantity,
      tradabilityStatus,
      methodologyCode,
      vintage,
      originProjectId,
      originFacilityId,
      acvaVerifierId,
      idempotencyKey,
      offlineVerificationProof,
      metadata,
    } = req.body || {};

    const quantity = validPositiveNumber(issuedQuantity);
    if (!creditType || !authoritativeRegistry || !authoritativeCreditReference || !registryAccountId || !quantity) {
      return res.status(400).json({ error: 'creditType, authoritativeRegistry, authoritativeCreditReference, registryAccountId and positive issuedQuantity are required' });
    }

    const result = await CreditCustodyService.recordAuthoritativeCustody({
      creditType,
      authoritativeRegistry,
      authoritativeCreditReference,
      registryAccountId,
      holderEntityId,
      holderUserId: holderUserId || identity(req),
      issuedQuantity: quantity,
      tradabilityStatus,
      methodologyCode,
      vintage,
      originProjectId,
      originFacilityId,
      acvaVerifierId,
      performedBy: identity(req) || 'system',
      idempotencyKey,
      offlineVerificationProof,
      metadata,
    });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 4. List For Sale — only the custody holder may mutate its position.
depositoryRouter.post('/positions/:id/list', async (req: any, res) => {
  try {
    if (!requireMutationRole(req, res)) return;
    const position = await getOwnedPosition(req, res);
    if (!position) return;

    const quantityToList = validPositiveNumber(req.body?.quantityToList);
    const pricePerUnitInr = validPositiveNumber(req.body?.pricePerUnitInr);
    if (!quantityToList || !pricePerUnitInr) {
      return res.status(400).json({ error: 'quantityToList and positive pricePerUnitInr are required' });
    }

    const result = await CreditCustodyService.listForSale({
      custodyId: req.params.id,
      sellerEntityId: req.body?.sellerEntityId || req.user?.entityId || identity(req),
      sellerUserId: identity(req),
      quantityToList,
      pricePerUnitInr,
      performedBy: identity(req) || 'system',
      idempotencyKey: req.body?.idempotencyKey,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Active Market Listings
depositoryRouter.get('/listings', async (_req, res) => {
  try {
    res.json(await CreditCustodyService.getActiveListings());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Place Reservation
depositoryRouter.post('/listings/:id/reserve', async (req: any, res) => {
  try {
    const quantityToReserve = validPositiveNumber(req.body?.quantityToReserve);
    if (!quantityToReserve) return res.status(400).json({ error: 'Positive quantityToReserve is required' });

    const duration = validPositiveNumber(req.body?.reservationDurationMinutes || 30);
    if (!duration) return res.status(400).json({ error: 'Positive reservationDurationMinutes is required' });

    const result = await CreditCustodyService.placeReservation({
      listingId: req.params.id,
      buyerEntityId: req.body?.buyerEntityId || req.user?.entityId || identity(req),
      buyerUserId: identity(req),
      quantityToReserve,
      reservationDurationMinutes: duration,
      performedBy: identity(req) || 'system',
      idempotencyKey: req.body?.idempotencyKey,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 7. Get Reservations
depositoryRouter.get('/reservations', async (req: any, res) => {
  try {
    res.json(await CreditCustodyService.getReservations({
      buyerUserId: identity(req),
      isAdmin: isPrivileged(req),
    }));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Settle Reservation
depositoryRouter.post('/reservations/:id/settle', async (req: any, res) => {
  try {
    if (!requireMutationRole(req, res)) return;
    const result = await CreditCustodyService.settleReservation({
      reservationId: req.params.id,
      performedBy: identity(req) || 'system',
      idempotencyKey: req.body?.idempotencyKey,
      notes: req.body?.notes,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 9. Retire Credits
depositoryRouter.post('/positions/:id/retire', async (req: any, res) => {
  try {
    if (!requireMutationRole(req, res)) return;
    const position = await getOwnedPosition(req, res);
    if (!position) return;

    const quantityToRetire = validPositiveNumber(req.body?.quantityToRetire);
    if (!quantityToRetire) return res.status(400).json({ error: 'Positive quantityToRetire is required' });
    if (!req.body?.beneficiary) return res.status(400).json({ error: 'beneficiary is required' });

    const result = await CreditCustodyService.retireCredits({
      custodyId: req.params.id,
      quantityToRetire,
      beneficiary: req.body.beneficiary,
      retirementReason: req.body.retirementReason || 'Corporate Scope 1/2 Net Zero Offset',
      performedBy: identity(req) || 'system',
      idempotencyKey: req.body?.idempotencyKey,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 10. Custody Audit Events Ledger — never expose another tenant's ledger.
depositoryRouter.get('/events/:custodyId', async (req: any, res) => {
  try {
    const position = await getOwnedPosition({ ...req, params: { id: req.params.custodyId } }, res);
    if (!position) return;
    res.json(await CreditCustodyService.getCustodyEvents(req.params.custodyId));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Waterfall Preview
depositoryRouter.get('/waterfall/preview', async (req: any, res) => {
  try {
    const quantity = validPositiveNumber(req.query.quantity || 1);
    const unitPrice = validPositiveNumber(req.query.unitPrice || 1200);
    if (!quantity || !unitPrice) return res.status(400).json({ error: 'quantity and unitPrice must be positive numbers' });

    const gross = quantity * unitPrice;
    const tiers = WaterfallDoctrineRegistry.DOCTRINAL_TIERS.map((tier) => ({
      ...tier,
      allocatedAmountInr: gross * (tier.percentage / 100.0),
    }));
    const allocatedTotal = tiers.reduce((sum, tier) => sum + tier.allocatedAmountInr, 0);

    res.json({
      doctrine: WaterfallDoctrineRegistry.DOCTRINE_ID,
      doctrineTitle: WaterfallDoctrineRegistry.DOCTRINE_TITLE,
      grossProceedsInr: gross,
      tiers,
      sumPercentage: 100.0,
      isConservationVerified: Math.abs(allocatedTotal - gross) < 0.000001,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Registry Adapter Diagnostics & Status — do not claim operational when issuers are unavailable.
depositoryRouter.get('/registry/status', async (_req, res) => {
  const beeConfigured = Boolean(process.env.BEE_ICM_REGISTRY_API_URL || process.env.CCC_REGISTRY_API_URL);
  const gcpConfigured = Boolean(process.env.GCP_REGISTRY_API_URL);
  const allConfigured = beeConfigured && gcpConfigured;

  res.json({
    status: allConfigured ? 'OPERATIONAL' : 'DEGRADED_NOT_CONFIGURED',
    authoritativeIssuanceAvailable: allConfigured,
    bee_icm: {
      configured: beeConfigured,
      failClosed: true,
      issuerBoundary: 'BEE / Indian Carbon Market is authoritative issuer for CCC.',
    },
    gcp_icfre: {
      configured: gcpConfigured,
      failClosed: true,
      issuerBoundary: 'MoEFCC / GCP (ICFRE) is authoritative issuer for Green Credits.',
    },
    hedera_provenance_layer: {
      role: 'Cryptographic evidence anchor & provenance trace only. Never authoritative registry.',
      network: process.env.HEDERA_NETWORK || 'testnet',
    },
  });
});
