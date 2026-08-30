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

function hashEvent(input: string): string { return crypto.createHash('sha256').update(input).digest('hex'); }

export async function getGcpCommercialState(positionId: string): Promise<GcpCommercialState | null> {
  const result = await pool.query(`SELECT state FROM gcp_commercial_lifecycle_events WHERE position_id=$1 ORDER BY sequence_no DESC LIMIT 1`, [positionId]);
  return result.rows[0]?.state ?? null;
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
    if (fromState) {
      assertGcpCommercialTransition(fromState, event.toState);
    } else if (event.toState !== 'CUSTODY_ACTIVE' && !isBuyerContinuation) {
      throw new Error(`GCP_LIFECYCLE_REQUIRES_CUSTODY_ACTIVE:${event.positionId}`);
    }

    const previousHash = latest.rows[0]?.event_hash ?? 'GENESIS';
    const payload = JSON.stringify({
      positionId: event.positionId, fromState: fromState ?? null, toState: event.toState,
      eventType: event.eventType, actorUid: event.actorUid ?? null,
      authoritativeReference: event.authoritativeReference ?? null, quantity: event.quantity ?? null,
      metadata: event.metadata ?? {},
    });
    const eventHash = hashEvent(`${previousHash}|${payload}`);

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
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}
