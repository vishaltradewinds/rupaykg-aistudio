import crypto from 'crypto';
import { createPool } from '../db/index.ts';
import { assertGcpCommercialTransition, type GcpCommercialState } from './gcpCommercialLifecycle.ts';

const pool = createPool();

type LifecycleEvent = {
  positionId: string;
  toState: GcpCommercialState;
  eventType: string;
  actorUid?: string;
  idempotencyKey?: string;
  authoritativeReference?: string;
  quantity?: number;
  metadata?: Record<string, unknown>;
};

export type GcpCommercialLifecycleAuditEvent = LifecycleEvent & {
  id: string;
  sequenceNo: number;
  fromState: GcpCommercialState | null;
  previousHash: string;
  eventHash: string;
};

function hashEvent(input: string): string { return crypto.createHash('sha256').update(input).digest('hex'); }

/** Canonical JSON is required because PostgreSQL jsonb does not guarantee object-key order on readback. */
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, canonicalize(item)]));
  }
  return value;
}

function expectedEventHash(event: Pick<GcpCommercialLifecycleAuditEvent, 'positionId' | 'fromState' | 'toState' | 'eventType' | 'actorUid' | 'authoritativeReference' | 'quantity' | 'metadata' | 'previousHash'>): string {
  const payload = JSON.stringify(canonicalize({
    positionId: event.positionId,
    fromState: event.fromState ?? null,
    toState: event.toState,
    eventType: event.eventType,
    actorUid: event.actorUid ?? null,
    authoritativeReference: event.authoritativeReference ?? null,
    quantity: event.quantity ?? null,
    metadata: event.metadata ?? {},
  }));
  return hashEvent(`${event.previousHash}|${payload}`);
}

export async function getGcpCommercialState(positionId: string): Promise<GcpCommercialState | null> {
  const result = await pool.query(`SELECT state FROM gcp_commercial_lifecycle_events WHERE position_id=$1 ORDER BY sequence_no DESC LIMIT 1`, [positionId]);
  return result.rows[0]?.state ?? null;
}

export async function getGcpCommercialLifecycleEvents(positionId: string): Promise<GcpCommercialLifecycleAuditEvent[]> {
  const result = await pool.query(`SELECT id, position_id, sequence_no, from_state, state, event_type, actor_uid, idempotency_key, authoritative_reference, quantity, metadata, previous_hash, event_hash FROM gcp_commercial_lifecycle_events WHERE position_id=$1 ORDER BY sequence_no ASC`, [positionId]);
  return result.rows.map((row) => ({
    id: row.id,
    positionId: row.position_id,
    sequenceNo: Number(row.sequence_no),
    fromState: row.from_state,
    toState: row.state,
    eventType: row.event_type,
    actorUid: row.actor_uid ?? undefined,
    idempotencyKey: row.idempotency_key ?? undefined,
    authoritativeReference: row.authoritative_reference ?? undefined,
    quantity: row.quantity == null ? undefined : Number(row.quantity),
    metadata: row.metadata ?? {},
    previousHash: row.previous_hash,
    eventHash: row.event_hash,
  }));
}

export async function verifyGcpCommercialLifecycleAudit(positionId: string): Promise<{ valid: boolean; eventCount: number; finalState: GcpCommercialState | null }> {
  const events = await getGcpCommercialLifecycleEvents(positionId);
  let previousHash = 'GENESIS';
  let previousState: GcpCommercialState | null = null;
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    if (event.sequenceNo !== index + 1) return { valid: false, eventCount: events.length, finalState: previousState };
    if (event.previousHash !== previousHash) return { valid: false, eventCount: events.length, finalState: previousState };
    if (event.fromState !== previousState) return { valid: false, eventCount: events.length, finalState: previousState };
    if (previousState) {
      try { assertGcpCommercialTransition(previousState, event.toState); } catch { return { valid: false, eventCount: events.length, finalState: previousState }; }
    } else if (event.toState !== 'CUSTODY_ACTIVE' && !event.metadata?.continuationOfPositionId) {
      return { valid: false, eventCount: events.length, finalState: previousState };
    }
    if (expectedEventHash(event) !== event.eventHash) return { valid: false, eventCount: events.length, finalState: previousState };
    previousHash = event.eventHash;
    previousState = event.toState;
  }
  return { valid: true, eventCount: events.length, finalState: previousState };
}

export async function recordGcpCommercialTransition(event: LifecycleEvent): Promise<GcpCommercialState> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (event.idempotencyKey) {
      const existing = await client.query(`SELECT state FROM gcp_commercial_lifecycle_events WHERE idempotency_key=$1`, [event.idempotencyKey]);
      if (existing.rows[0]) { await client.query('COMMIT'); return existing.rows[0].state as GcpCommercialState; }
    }
    const latest = await client.query(`SELECT state, event_hash FROM gcp_commercial_lifecycle_events WHERE position_id=$1 ORDER BY sequence_no DESC LIMIT 1 FOR UPDATE`, [event.positionId]);
    const fromState = latest.rows[0]?.state as GcpCommercialState | undefined;
    const isBuyerContinuation = Boolean(event.metadata?.continuationOfPositionId) && event.toState === 'TRANSFER_CONFIRMED';
    if (fromState) assertGcpCommercialTransition(fromState, event.toState);
    else if (event.toState !== 'CUSTODY_ACTIVE' && !isBuyerContinuation) throw new Error(`GCP_LIFECYCLE_REQUIRES_CUSTODY_ACTIVE:${event.positionId}`);
    const previousHash = latest.rows[0]?.event_hash ?? 'GENESIS';
    const eventHash = expectedEventHash({
      positionId: event.positionId, fromState: fromState ?? null, toState: event.toState,
      eventType: event.eventType, actorUid: event.actorUid,
      authoritativeReference: event.authoritativeReference, quantity: event.quantity,
      metadata: event.metadata, previousHash,
    });
    await client.query(
      `INSERT INTO gcp_commercial_lifecycle_events
       (id, position_id, sequence_no, from_state, state, event_type, actor_uid,
        idempotency_key, authoritative_reference, quantity, metadata, previous_hash, event_hash)
       VALUES ($1, $2, COALESCE((SELECT MAX(sequence_no)+1 FROM gcp_commercial_lifecycle_events WHERE position_id=$2), 1),
       $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [crypto.randomUUID(), event.positionId, fromState ?? null, event.toState, event.eventType,
       event.actorUid ?? null, event.idempotencyKey ?? null, event.authoritativeReference ?? null,
       event.quantity ?? null, JSON.stringify(event.metadata ?? {}), previousHash, eventHash],
    );
    await client.query('COMMIT');
    return event.toState;
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
