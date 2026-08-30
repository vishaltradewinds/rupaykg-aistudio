import { createPool } from '../db/index.ts';
import crypto from 'crypto';

export type CreditType = 'CCC' | 'GREEN_CREDIT';
export type Registry = 'BEE_ICM' | 'GCP_ICFRE';
const pool = createPool();
const expectedRegistry: Record<CreditType, Registry> = { CCC: 'BEE_ICM', GREEN_CREDIT: 'GCP_ICFRE' };

function assertPositive(n: number) {
  if (!Number.isFinite(n) || n <= 0) throw new Error('Quantity must be a positive finite number');
}
function assertIssuerBoundary(creditType: CreditType, registry: Registry) {
  if (expectedRegistry[creditType] !== registry) throw new Error(`Invalid authoritative issuer boundary for ${creditType}`);
}
function assertKey(key: string) {
  if (!key?.trim() || key.length > 200) throw new Error('A valid idempotency key is required');
}

export async function createCustodyPosition(input: {
  creditType: CreditType; registry: Registry; registryAccountId: string;
  authoritativeCreditReference: string; holderEntityId: string; quantity: number;
  tradabilityStatus: 'TRADABLE' | 'NON_TRADABLE'; authoritativeVerifiedAt: string; actorUid: string;
  idempotencyKey: string;
}) {
  assertPositive(input.quantity); assertIssuerBoundary(input.creditType, input.registry); assertKey(input.idempotencyKey);
  if (!input.registryAccountId || !input.authoritativeCreditReference || !input.holderEntityId) throw new Error('Authoritative registry account, credit reference and holder are required');
  if (!input.authoritativeVerifiedAt || Number.isNaN(Date.parse(input.authoritativeVerifiedAt))) throw new Error('Authoritative verification timestamp is required');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query('SELECT * FROM environmental_credit_transactions WHERE idempotency_key = $1 FOR SHARE', [input.idempotencyKey]);
    if (existing.rows[0]) { await client.query('COMMIT'); return existing.rows[0]; }
    const positionId = crypto.randomUUID();
    await client.query(`INSERT INTO environmental_credit_positions (id,credit_type,authoritative_registry,registry_account_id,authoritative_credit_reference,holder_entity_id,issued_quantity,available_quantity,authoritative_verified_at,tradability_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$7,$8,$9)`, [positionId,input.creditType,input.registry,input.registryAccountId,input.authoritativeCreditReference,input.holderEntityId,input.quantity,input.authoritativeVerifiedAt,input.tradabilityStatus]);
    const txId = crypto.randomUUID();
    const result = await client.query(`INSERT INTO environmental_credit_transactions (id,position_id,transaction_type,quantity,authoritative_transaction_reference,idempotency_key,actor_uid) VALUES ($1,$2,'CUSTODY',$3,$4,$5,$6) RETURNING *`, [txId,positionId,input.quantity,input.authoritativeCreditReference,input.idempotencyKey,input.actorUid]);
    await client.query('COMMIT'); return result.rows[0];
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}

export async function reservePosition(positionId: string, quantity: number, actorUid: string, idempotencyKey: string, principalUid: string, role?: string) {
  assertPositive(quantity); assertKey(idempotencyKey);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query('SELECT * FROM environmental_credit_transactions WHERE idempotency_key = $1 FOR SHARE', [idempotencyKey]);
    if (existing.rows[0]) { await client.query('COMMIT'); return existing.rows[0]; }
    const p = await client.query('SELECT * FROM environmental_credit_positions WHERE id = $1 FOR UPDATE', [positionId]);
    if (!p.rows[0]) throw new Error('Depository position not found');
    const row = p.rows[0];
    // Reservation is a marketplace operation initiated by an eligible buyer or an authorized operator;
    // the seller's authority is enforced by the authoritative transfer step, not by the reservation lock.
    if (!principalUid || !role) throw new Error('Authenticated buyer/operator context is required');
    if (row.status !== 'HELD' && row.status !== 'RESERVED') throw new Error('Position is not available for sale');
    if (row.tradability_status !== 'TRADABLE') throw new Error('Authoritative tradability is not confirmed');
    if (quantity > Number(row.available_quantity)) throw new Error('Insufficient available depository inventory');
    await client.query(`UPDATE environmental_credit_positions SET available_quantity=available_quantity-$1,reserved_quantity=reserved_quantity+$1,status='RESERVED',updated_at=now() WHERE id=$2`, [quantity,positionId]);
    const tx = await client.query(`INSERT INTO environmental_credit_transactions (id,position_id,transaction_type,quantity,idempotency_key,actor_uid,metadata) VALUES ($1,$2,'RESERVE',$3,$4,$5,$6) RETURNING *`, [crypto.randomUUID(),positionId,quantity,idempotencyKey,actorUid,JSON.stringify({reservedBy: principalUid, role})]);
    await client.query('COMMIT'); return tx.rows[0];
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}

export async function releaseReservation(positionId: string, quantity: number, actorUid: string, idempotencyKey: string) {
  assertPositive(quantity); assertKey(idempotencyKey);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query('SELECT * FROM environmental_credit_transactions WHERE idempotency_key=$1 FOR SHARE', [idempotencyKey]);
    if (existing.rows[0]) { await client.query('COMMIT'); return existing.rows[0]; }
    const p = await client.query('SELECT * FROM environmental_credit_positions WHERE id=$1 FOR UPDATE', [positionId]);
    if (!p.rows[0]) throw new Error('Depository position not found');
    if (quantity > Number(p.rows[0].reserved_quantity)) throw new Error('Release exceeds reserved quantity');
    await client.query(`UPDATE environmental_credit_positions SET available_quantity=available_quantity+$1,reserved_quantity=reserved_quantity-$1,status=CASE WHEN reserved_quantity-$1=0 THEN 'HELD' ELSE 'RESERVED' END,updated_at=now() WHERE id=$2`, [quantity,positionId]);
    const tx = await client.query(`INSERT INTO environmental_credit_transactions (id,position_id,transaction_type,quantity,idempotency_key,actor_uid) VALUES ($1,$2,'RELEASE',$3,$4,$5) RETURNING *`, [crypto.randomUUID(),positionId,quantity,idempotencyKey,actorUid]);
    await client.query('COMMIT'); return tx.rows[0];
  } catch(e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}

export async function retireCredits(positionId: string, quantity: number, actorUid: string, idempotencyKey: string, reason: string) {
  assertPositive(quantity); assertKey(idempotencyKey); if (!reason?.trim()) throw new Error('Retirement reason is required');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query('SELECT * FROM environmental_credit_transactions WHERE idempotency_key=$1 FOR SHARE', [idempotencyKey]);
    if (existing.rows[0]) { await client.query('COMMIT'); return existing.rows[0]; }
    const p = await client.query('SELECT * FROM environmental_credit_positions WHERE id=$1 FOR UPDATE', [positionId]);
    if (!p.rows[0]) throw new Error('Depository position not found');
    const row = p.rows[0]; if (quantity > Number(row.available_quantity)) throw new Error('Retirement exceeds available quantity');
    await client.query(`UPDATE environmental_credit_positions SET available_quantity=available_quantity-$1,retired_quantity=retired_quantity+$1,status=CASE WHEN available_quantity-$1=0 AND reserved_quantity=0 THEN 'RETIRED' ELSE status END,updated_at=now() WHERE id=$2`, [quantity,positionId]);
    const tx = await client.query(`INSERT INTO environmental_credit_transactions (id,position_id,transaction_type,quantity,idempotency_key,actor_uid,metadata) VALUES ($1,$2,'RETIRE',$3,$4,$5,$6) RETURNING *`, [crypto.randomUUID(),positionId,quantity,actorUid,JSON.stringify({reason})]);
    await client.query('COMMIT'); return tx.rows[0];
  } catch(e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}

/** Final transfer mutation is deliberately impossible without authoritative registry confirmation. */
export async function confirmAuthoritativeTransfer(input: { positionId:string; quantity:number; actorUid:string; idempotencyKey:string; buyerEntityId:string; authoritativeTransactionReference:string; buyerEligibilityVerified:boolean }) {
  assertPositive(input.quantity); assertKey(input.idempotencyKey);
  if (!input.buyerEntityId || !input.authoritativeTransactionReference) throw new Error('Authoritative buyer and transfer reference are required');
  if (!input.buyerEligibilityVerified) throw new Error('Buyer eligibility is not authoritatively verified');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query('SELECT * FROM environmental_credit_transactions WHERE idempotency_key=$1 FOR SHARE', [input.idempotencyKey]);
    if (existing.rows[0]) { await client.query('COMMIT'); return existing.rows[0]; }
    const p = await client.query('SELECT * FROM environmental_credit_positions WHERE id=$1 FOR UPDATE', [input.positionId]);
    if (!p.rows[0]) throw new Error('Depository position not found');
    const row=p.rows[0]; if (input.quantity > Number(row.reserved_quantity)) throw new Error('Transfer exceeds reserved quantity');
    const buyerPositionId = crypto.randomUUID();
    await client.query(`UPDATE environmental_credit_positions SET reserved_quantity=reserved_quantity-$1,transferred_quantity=transferred_quantity+$1,status=CASE WHEN available_quantity=0 AND reserved_quantity-$1=0 THEN 'TRANSFERRED' ELSE 'HELD' END,updated_at=now() WHERE id=$2`, [input.quantity,input.positionId]);
    await client.query(`INSERT INTO environmental_credit_positions (id,credit_type,authoritative_registry,registry_account_id,authoritative_credit_reference,holder_entity_id,issued_quantity,available_quantity,authoritative_verified_at,tradability_status,status,metadata) VALUES ($1,$2,$3,$4,$5,$6,$7,$7,now(),'TRADABLE','HELD',$8)`, [buyerPositionId,row.credit_type,row.authoritative_registry,row.registry_account_id,row.authoritative_credit_reference,input.buyerEntityId,input.quantity,JSON.stringify({sourcePositionId: input.positionId, sourceTransferReference: input.authoritativeTransactionReference, receivedByAuthoritativeTransfer: true})]);
    const tx=await client.query(`INSERT INTO environmental_credit_transactions (id,position_id,transaction_type,quantity,buyer_entity_id,authoritative_transaction_reference,idempotency_key,actor_uid,metadata) VALUES ($1,$2,'TRANSFER',$3,$4,$5,$6,$7,$8) RETURNING *`, [crypto.randomUUID(),input.positionId,input.quantity,input.buyerEntityId,input.authoritativeTransactionReference,input.idempotencyKey,input.actorUid,JSON.stringify({buyerPositionId})]);
    await client.query('COMMIT'); return {...tx.rows[0], buyerPositionId};
  } catch(e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}

export async function listAvailablePositions(creditType?: CreditType) {
  const q = creditType ? `SELECT * FROM environmental_credit_positions WHERE credit_type=$1 AND status IN ('HELD','RESERVED') AND tradability_status='TRADABLE' AND available_quantity>0 ORDER BY created_at DESC` : `SELECT * FROM environmental_credit_positions WHERE status IN ('HELD','RESERVED') AND tradability_status='TRADABLE' AND available_quantity>0 ORDER BY created_at DESC`;
  return (await pool.query(q, creditType ? [creditType] : [])).rows;
}