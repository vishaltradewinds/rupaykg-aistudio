import { createPool } from '../db/index.ts';
import crypto from 'crypto';

export type CreditType = 'CCC' | 'GREEN_CREDIT';
export type Registry = 'BEE_ICM' | 'GCP_ICFRE';

const pool = createPool();

function assertPositive(n: number) {
  if (!Number.isFinite(n) || n <= 0) throw new Error('Quantity must be a positive finite number');
}

export async function createCustodyPosition(input: {
  creditType: CreditType; registry: Registry; registryAccountId: string;
  authoritativeCreditReference: string; holderEntityId: string; quantity: number;
  tradabilityStatus: 'TRADABLE' | 'NON_TRADABLE'; authoritativeVerifiedAt: string; actorUid: string;
  idempotencyKey: string;
}) {
  assertPositive(input.quantity);
  if (!input.registryAccountId || !input.authoritativeCreditReference || !input.holderEntityId) throw new Error('Authoritative registry account, credit reference and holder are required');
  if (input.tradabilityStatus !== 'TRADABLE') throw new Error('Credit is not confirmed tradable');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query('SELECT * FROM environmental_credit_transactions WHERE idempotency_key = $1 FOR SHARE', [input.idempotencyKey]);
    if (existing.rows[0]) { await client.query('COMMIT'); return existing.rows[0]; }
    const positionId = crypto.randomUUID();
    await client.query(`INSERT INTO environmental_credit_positions
      (id,credit_type,authoritative_registry,registry_account_id,authoritative_credit_reference,holder_entity_id,issued_quantity,available_quantity,authoritative_verified_at,tradability_status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$7,$8,$9)`, [positionId,input.creditType,input.registry,input.registryAccountId,input.authoritativeCreditReference,input.holderEntityId,input.quantity,input.authoritativeVerifiedAt,input.tradabilityStatus]);
    const txId = crypto.randomUUID();
    const result = await client.query(`INSERT INTO environmental_credit_transactions
      (id,position_id,transaction_type,quantity,authoritative_transaction_reference,idempotency_key,actor_uid)
      VALUES ($1,$2,'CUSTODY',$3,$4,$5,$6) RETURNING *`, [txId,positionId,input.quantity,input.authoritativeCreditReference,input.idempotencyKey,input.actorUid]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}

export async function reservePosition(positionId: string, quantity: number, actorUid: string, idempotencyKey: string) {
  assertPositive(quantity);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query('SELECT * FROM environmental_credit_transactions WHERE idempotency_key = $1 FOR SHARE', [idempotencyKey]);
    if (existing.rows[0]) { await client.query('COMMIT'); return existing.rows[0]; }
    const p = await client.query('SELECT * FROM environmental_credit_positions WHERE id = $1 FOR UPDATE', [positionId]);
    if (!p.rows[0]) throw new Error('Depository position not found');
    const row = p.rows[0];
    if (row.status !== 'HELD' && row.status !== 'RESERVED') throw new Error('Position is not available for sale');
    if (row.tradability_status !== 'TRADABLE') throw new Error('Authoritative tradability is not confirmed');
    if (quantity > Number(row.available_quantity)) throw new Error('Insufficient available depository inventory');
    await client.query(`UPDATE environmental_credit_positions SET available_quantity=available_quantity-$1,reserved_quantity=reserved_quantity+$1,status='RESERVED',updated_at=now() WHERE id=$2`, [quantity,positionId]);
    const tx = await client.query(`INSERT INTO environmental_credit_transactions (id,position_id,transaction_type,quantity,idempotency_key,actor_uid) VALUES ($1,$2,'RESERVE',$3,$4,$5) RETURNING *`, [crypto.randomUUID(),positionId,quantity,idempotencyKey,actorUid]);
    await client.query('COMMIT'); return tx.rows[0];
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}

export async function listAvailablePositions(creditType?: CreditType) {
  const q = creditType ? `SELECT * FROM environmental_credit_positions WHERE credit_type=$1 AND status IN ('HELD','RESERVED') AND tradability_status='TRADABLE' AND available_quantity>0 ORDER BY created_at DESC` : `SELECT * FROM environmental_credit_positions WHERE status IN ('HELD','RESERVED') AND tradability_status='TRADABLE' AND available_quantity>0 ORDER BY created_at DESC`;
  return (await pool.query(q, creditType ? [creditType] : [])).rows;
}
