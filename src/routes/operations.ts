import { Router } from 'express';
import crypto from 'crypto';
import { MassBalanceService, MassBalanceViolationError } from '../services/massBalanceService.ts';
import { HederaAnchorProvider } from '../services/hederaAnchor.ts';
import { CredentialService } from '../services/credentialService.ts';
import { isRedisConnected } from '../lib/redis.ts';
import { db } from '../db/index.ts';
import { users as dbUsers } from '../db/schema.ts';

export const operationsRouter = Router();

/**
 * Facility Physical Mass Balance Ledger (Inward Weighbridge/Manifests vs Outward Claims)
 */
operationsRouter.get('/facilities/:id/mass-balance', async (req: any, res) => {
  try {
    const summary = await MassBalanceService.getFacilityMassBalance(req.params.id);
    res.json(summary);
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to compute facility mass balance.' });
  }
});

operationsRouter.post('/facilities/:id/mass-balance/claim', async (req: any, res) => {
  try {
    const { requestedOutwardKg, quantity_kg, outputType, output_type, claimCategory, referenceId, metadata } =
      req.body || {};
    const qty = Number(requestedOutwardKg ?? quantity_kg);
    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Positive requestedOutwardKg is required.' });
    }

    const result = await MassBalanceService.assertAndRecordOutwardClaim({
      facilityId: req.params.id,
      requestedOutwardKg: qty,
      outputType: String(outputType || output_type || 'PROCESSED_RESOURCE'),
      claimCategory: claimCategory || 'PROCESSING_OUTPUT',
      actorId: req.user?.uid || req.user?.id || 'system',
      referenceId,
      metadata,
    });

    res.status(201).json(result);
  } catch (err: any) {
    if (err instanceof MassBalanceViolationError) {
      return res.status(err.statusCode).json({
        error: err.message,
        code: err.code,
        details: err.details,
      });
    }
    res.status(500).json({ error: err?.message || 'Mass balance claim verification failed.' });
  }
});

/**
 * Production Trust Keys, Object Evidence Storage, Regulatory Integrations & Infrastructure Readiness Audit
 */
operationsRouter.get('/trust/readiness', async (_req: any, res) => {
  const vcPriv = process.env.VC_ISSUER_PRIVATE_KEY;
  const vcPub = process.env.VC_ISSUER_PUBLIC_KEY;
  let vcKeyPairValid = false;
  let vcKeyAlgorithm: string | null = null;
  let vcKeyError: string | null = null;

  if (vcPriv && vcPub && !vcPriv.includes('placeholder') && !vcPub.includes('placeholder')) {
    try {
      const priv = crypto.createPrivateKey(vcPriv);
      const pub = crypto.createPublicKey(vcPub);
      const derived = crypto.createPublicKey(priv).export({ type: 'spki', format: 'der' });
      const configured = pub.export({ type: 'spki', format: 'der' });
      vcKeyPairValid =
        priv.asymmetricKeyType === pub.asymmetricKeyType &&
        Buffer.from(derived).equals(Buffer.from(configured));
      vcKeyAlgorithm = priv.asymmetricKeyType || null;
      if (!vcKeyPairValid) vcKeyError = 'VC_ISSUER_PUBLIC_KEY does not match VC_ISSUER_PRIVATE_KEY.';
    } catch (e: any) {
      vcKeyError = e?.message || 'Invalid VC key PEM format.';
    }
  } else {
    vcKeyError = 'VC_ISSUER_PRIVATE_KEY and/or VC_ISSUER_PUBLIC_KEY not configured.';
  }

  let dbConnected = false;
  if (db) {
    try {
      await db.select({ id: dbUsers.id }).from(dbUsers).limit(1);
      dbConnected = true;
    } catch {
      dbConnected = false;
    }
  }

  const hedera = HederaAnchorProvider.getAnchorStatus();
  const evidenceStorageBucket = process.env.GCS_EVIDENCE_BUCKET || process.env.OBJECT_STORAGE_BUCKET || null;
  const cpcbConfigured = Boolean(process.env.CPCB_API_URL && process.env.CPCB_API_KEY);
  const scadaConfigured = Boolean(process.env.WEIGHBRIDGE_SCADA_URL);
  const geminiConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'fallback_key' &&
      process.env.GEMINI_API_KEY.trim().length >= 10
  );

  res.json({
    checkedAt: new Date().toISOString(),
    postgresql: {
      configured: Boolean(db),
      connected: dbConnected,
      status: dbConnected ? 'CONNECTED' : 'UNAVAILABLE',
    },
    redis: {
      connected: isRedisConnected(),
      status: isRedisConnected() ? 'CONNECTED' : 'NOT_CONNECTED',
    },
    verifiableCredentials: {
      issuerDid: CredentialService.DEFAULT_ISSUER_DID,
      configured: vcKeyPairValid,
      algorithm: vcKeyAlgorithm,
      status: vcKeyPairValid ? 'READY' : 'NOT_CONFIGURED',
      error: vcKeyError,
    },
    hederaHcs: {
      network: hedera.network,
      topicId: hedera.topicId,
      readStatus: hedera.readStatus,
      writeStatus: hedera.writeStatus,
      configured: hedera.isConfigured,
    },
    evidenceObjectStorage: {
      configured: Boolean(evidenceStorageBucket),
      bucket: evidenceStorageBucket || 'NOT_CONFIGURED',
      status: evidenceStorageBucket ? 'CONFIGURED' : 'INLINE_POSTGRESQL_HASH_ONLY',
    },
    externalConnectors: {
      geminiAi: geminiConfigured ? 'CONFIGURED' : 'NOT_CONFIGURED',
      cpcbPortal: cpcbConfigured ? 'CONFIGURED' : 'NOT_CONFIGURED',
      weighbridgeScada: scadaConfigured ? 'CONFIGURED' : 'NOT_CONFIGURED',
      lgdDirectory: 'LOCAL_INDEX_FALLBACK',
    },
  });
});
