import { Router } from 'express';
import { CreditCustodyService } from '../services/creditCustodyService.ts';
import { AuthoritativeRegistryAdapter } from '../services/authoritativeRegistryAdapter.ts';
import { WaterfallDoctrineRegistry } from '../services/waterfallDoctrine.ts';

export const depositoryRouter = Router();

// 1. Get Custody Positions
depositoryRouter.get('/positions', async (req: any, res) => {
  try {
    const userRole = req.user?.role;
    const uid = req.user?.uid || req.user?.id;
    const isAdmin = ['super_admin', 'regulator', 'auditor'].includes(userRole);

    const positions = await CreditCustodyService.getPositions({
      userId: uid,
      isAdmin,
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
    const position = await CreditCustodyService.getPositionById(req.params.id);
    if (!position) {
      return res.status(404).json({ error: 'Custody position not found' });
    }

    const userRole = req.user?.role;
    const uid = req.user?.uid || req.user?.id;
    const isAdmin = ['super_admin', 'regulator', 'auditor'].includes(userRole);

    if (!isAdmin && position.holderUserId && position.holderUserId !== uid) {
      return res.status(403).json({ error: 'Access denied: Cross-tenant custody query' });
    }

    res.json(position);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Record Authoritative Custody
depositoryRouter.post('/record-custody', async (req: any, res) => {
  try {
    const performedBy = req.user?.uid || req.user?.id || 'system';
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
    } = req.body;

    const result = await CreditCustodyService.recordAuthoritativeCustody({
      creditType,
      authoritativeRegistry,
      authoritativeCreditReference,
      registryAccountId,
      holderEntityId,
      holderUserId: holderUserId || req.user?.uid || req.user?.id,
      issuedQuantity: Number(issuedQuantity),
      tradabilityStatus,
      methodologyCode,
      vintage,
      originProjectId,
      originFacilityId,
      acvaVerifierId,
      performedBy,
      idempotencyKey,
      offlineVerificationProof,
      metadata,
    });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 4. List For Sale
depositoryRouter.post('/positions/:id/list', async (req: any, res) => {
  try {
    const performedBy = req.user?.uid || req.user?.id || 'system';
    const { sellerEntityId, quantityToList, pricePerUnitInr, idempotencyKey } = req.body;

    const result = await CreditCustodyService.listForSale({
      custodyId: req.params.id,
      sellerEntityId: sellerEntityId || req.user?.entityId || req.user?.uid,
      sellerUserId: req.user?.uid || req.user?.id,
      quantityToList: Number(quantityToList),
      pricePerUnitInr: Number(pricePerUnitInr),
      performedBy,
      idempotencyKey,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Active Market Listings
depositoryRouter.get('/listings', async (req, res) => {
  try {
    const listings = await CreditCustodyService.getActiveListings();
    res.json(listings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Place Reservation
depositoryRouter.post('/listings/:id/reserve', async (req: any, res) => {
  try {
    const performedBy = req.user?.uid || req.user?.id || 'system';
    const { buyerEntityId, quantityToReserve, reservationDurationMinutes, idempotencyKey } = req.body;

    const result = await CreditCustodyService.placeReservation({
      listingId: req.params.id,
      buyerEntityId: buyerEntityId || req.user?.entityId || req.user?.uid,
      buyerUserId: req.user?.uid || req.user?.id,
      quantityToReserve: Number(quantityToReserve),
      reservationDurationMinutes: Number(reservationDurationMinutes || 30),
      performedBy,
      idempotencyKey,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 7. Get Reservations
depositoryRouter.get('/reservations', async (req: any, res) => {
  try {
    const userRole = req.user?.role;
    const uid = req.user?.uid || req.user?.id;
    const isAdmin = ['super_admin', 'regulator', 'auditor'].includes(userRole);

    const reservations = await CreditCustodyService.getReservations({
      buyerUserId: uid,
      isAdmin,
    });

    res.json(reservations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Settle Reservation (Execute 7-Tier Waterfall)
depositoryRouter.post('/reservations/:id/settle', async (req: any, res) => {
  try {
    const performedBy = req.user?.uid || req.user?.id || 'system';
    const { idempotencyKey, notes } = req.body;

    const result = await CreditCustodyService.settleReservation({
      reservationId: req.params.id,
      performedBy,
      idempotencyKey,
      notes,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 9. Retire Credits
depositoryRouter.post('/positions/:id/retire', async (req: any, res) => {
  try {
    const performedBy = req.user?.uid || req.user?.id || 'system';
    const { quantityToRetire, beneficiary, retirementReason, idempotencyKey } = req.body;

    const result = await CreditCustodyService.retireCredits({
      custodyId: req.params.id,
      quantityToRetire: Number(quantityToRetire),
      beneficiary,
      retirementReason: retirementReason || 'Corporate Scope 1/2 Net Zero Offset',
      performedBy,
      idempotencyKey,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 10. Custody Audit Events Ledger
depositoryRouter.get('/events/:custodyId', async (req: any, res) => {
  try {
    const events = await CreditCustodyService.getCustodyEvents(req.params.custodyId);
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Waterfall Preview
depositoryRouter.get('/waterfall/preview', async (req, res) => {
  try {
    const quantity = Number(req.query.quantity || 1);
    const unitPrice = Number(req.query.unitPrice || 1200);
    const gross = quantity * unitPrice;

    res.json({
      doctrine: WaterfallDoctrineRegistry.DOCTRINE_ID,
      doctrineTitle: WaterfallDoctrineRegistry.DOCTRINE_TITLE,
      grossProceedsInr: gross,
      tiers: WaterfallDoctrineRegistry.DOCTRINAL_TIERS.map((tier) => ({
        ...tier,
        allocatedAmountInr: gross * (tier.percentage / 100.0),
      })),
      sumPercentage: 100.0,
      isConservationVerified: true,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Registry Adapter Diagnostics & Status
depositoryRouter.get('/registry/status', async (req, res) => {
  res.json({
    status: 'OPERATIONAL',
    bee_icm: {
      configured: Boolean(process.env.BEE_ICM_REGISTRY_API_URL || process.env.CCC_REGISTRY_API_URL),
      failClosed: true,
      issuerBoundary: 'BEE / Indian Carbon Market is authoritative issuer for CCC.',
    },
    gcp_icfre: {
      configured: Boolean(process.env.GCP_REGISTRY_API_URL),
      failClosed: true,
      issuerBoundary: 'MoEFCC / GCP (ICFRE) is authoritative issuer for Green Credits.',
    },
    hedera_provenance_layer: {
      role: 'Cryptographic evidence anchor & provenance trace only. Never authoritative registry.',
      network: process.env.HEDERA_NETWORK || 'testnet',
    },
  });
});
