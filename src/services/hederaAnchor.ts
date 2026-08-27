import crypto from 'crypto';
import { db } from '../db/index';
import { hedera_anchors } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export type HederaAnchorState =
  | 'NOT_CONFIGURED'
  | 'READY'
  | 'SUBMITTING'
  | 'SUBMITTED'
  | 'CONSENSUS_CONFIRMED'
  | 'FAILED'
  | 'RETRYABLE_FAILURE'
  | 'PERMANENT_FAILURE'
  | 'NOT_AVAILABLE';

export interface HederaAnchorStatus {
  readStatus: 'AVAILABLE' | 'UNAVAILABLE';
  writeStatus: 'NOT_AVAILABLE' | 'AVAILABLE' | 'FAILED' | 'READY';
  consensusStatus: 'NOT_AVAILABLE' | 'CONFIRMED' | 'PENDING' | 'CONFIGURED';
  network: 'testnet' | 'mainnet' | 'previewnet';
  mirrorNodeEndpoint: string;
  topicId: string;
  isConfigured: boolean;
  message?: string;
}

export interface HederaSubmitResult {
  id?: string;
  status: HederaAnchorState;
  transactionId: string | null;
  consensusTimestamp: string | null;
  topicId: string;
  network: string;
  integrityHash: string;
  attemptCount: number;
  isSimulated: false;
  message: string;
  persistedToDb?: boolean;
}

export interface AnchorSubmissionPayload {
  eventType: string;
  recordId: string;
  credentialId?: string;
  weightKg?: number;
  carbonAvoidanceKg?: number;
  metadata?: Record<string, any>;
}

/**
 * Enterprise Hedera Consensus Service (HCS) Anchor Provider
 * 
 * Strict Zero-Assumption & Cryptographic Truth Standards:
 * 1. Read Stream is live against official Hedera Mirror Nodes (Testnet/Mainnet).
 * 2. Write Anchoring uses real @hashgraph/sdk when HEDERA_OPERATOR_ID & HEDERA_OPERATOR_KEY are configured.
 * 3. When credentials are not configured or are placeholders, the engine strictly fails closed:
 *    - Returns status 'NOT_AVAILABLE' or 'NOT_CONFIGURED'
 *    - transactionId is explicitly null
 *    - consensusTimestamp is explicitly null
 *    - local SHA-256 payload integrity digest is computed
 *    - isSimulated is strictly false
 * 4. All anchor operations and state transitions are persisted in PostgreSQL (hedera_anchors table).
 * 5. Idempotent: Duplicate submissions for identical payload hashes return existing confirmed records.
 */
export class HederaAnchorProvider {
  public static readonly DEFAULT_TOPIC_ID = process.env.HEDERA_TOPIC_ID || '0.0.4592011';
  public static readonly DEFAULT_NETWORK = (process.env.HEDERA_NETWORK as 'testnet' | 'mainnet' | 'previewnet') || 'testnet';

  public static getMirrorNodeEndpoint(network: string = this.DEFAULT_NETWORK): string {
    if (network === 'mainnet') return 'https://mainnet-public.mirrornode.hedera.com';
    if (network === 'previewnet') return 'https://previewnet.mirrornode.hedera.com';
    return 'https://testnet.mirrornode.hedera.com';
  }

  /**
   * Check whether real Hedera operator credentials are present in runtime environment.
   */
  public static isOperatorConfigured(): boolean {
    const id = process.env.HEDERA_OPERATOR_ID;
    const key = process.env.HEDERA_OPERATOR_KEY;
    if (!id || !key) return false;
    if (key.includes('placeholder') || key.includes('your_') || key.length < 20) return false;
    return true;
  }

  /**
   * Determine live status of Hedera integration layers
   */
  public static getAnchorStatus(topicId: string = this.DEFAULT_TOPIC_ID): HederaAnchorStatus {
    const configured = this.isOperatorConfigured();
    const network = this.DEFAULT_NETWORK;
    const mirrorNodeEndpoint = this.getMirrorNodeEndpoint(network);

    return {
      readStatus: 'AVAILABLE',
      writeStatus: configured ? 'AVAILABLE' : 'NOT_AVAILABLE',
      consensusStatus: configured ? 'CONFIGURED' : 'NOT_AVAILABLE',
      network,
      mirrorNodeEndpoint,
      topicId: topicId || this.DEFAULT_TOPIC_ID,
      isConfigured: configured,
      message: configured
        ? `Hedera HCS Operator Credentials Configured for ${network.toUpperCase()}. Live anchoring active.`
        : `Hedera HCS Read Stream is Active via Public Mirror Node (${mirrorNodeEndpoint}). HCS Write Anchoring is NOT_AVAILABLE until HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY are configured in the runtime environment.`
    };
  }

  /**
   * Compute standard deterministic SHA-256 canonical hash of any payload.
   */
  public static computePayloadHash(payload: any): string {
    const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return crypto.createHash('sha256').update(serialized).digest('hex');
  }

  /**
   * Submit an integrity payload to Hedera HCS with full state machine and DB persistence.
   */
  public static async submitAnchor(
    payload: AnchorSubmissionPayload,
    topicId: string = this.DEFAULT_TOPIC_ID,
    userId?: string
  ): Promise<HederaSubmitResult> {
    const network = this.DEFAULT_NETWORK;
    const effectiveTopicId = topicId || this.DEFAULT_TOPIC_ID;
    const payloadHash = this.computePayloadHash(payload);
    const anchorId = `ANC-${crypto.randomBytes(8).toString('hex')}`;

    // 1. Idempotency Check: check if already anchored in DB
    if (db) {
      try {
        const existing = await db
          .select()
          .from(hedera_anchors)
          .where(
            and(
              eq(hedera_anchors.payloadHash, payloadHash),
              eq(hedera_anchors.topicId, effectiveTopicId)
            )
          )
          .limit(1);

        if (existing.length > 0 && (existing[0].status === 'CONSENSUS_CONFIRMED' || existing[0].status === 'SUBMITTED')) {
          const rec = existing[0];
          return {
            id: rec.id,
            status: rec.status as HederaAnchorState,
            transactionId: rec.transactionId,
            consensusTimestamp: rec.consensusTimestamp,
            topicId: rec.topicId,
            network: rec.network,
            integrityHash: rec.payloadHash,
            attemptCount: rec.attemptCount,
            isSimulated: false,
            message: `Existing anchor retrieved for payload hash (Idempotent replay). Status: ${rec.status}`,
            persistedToDb: true
          };
        }
      } catch (dbErr: any) {
        console.warn('[HederaAnchorProvider] Idempotency DB lookup warning:', dbErr.message);
      }
    }

    // 2. Fail-closed check when operator credentials are missing
    if (!this.isOperatorConfigured()) {
      const result: HederaSubmitResult = {
        id: anchorId,
        status: 'NOT_AVAILABLE',
        transactionId: null,
        consensusTimestamp: null,
        topicId: effectiveTopicId,
        network,
        integrityHash: payloadHash,
        attemptCount: 0,
        isSimulated: false,
        message: 'HCS Write Consensus Anchoring is currently NOT_AVAILABLE. Payload integrity hash computed locally (SHA-256).',
        persistedToDb: false
      };

      if (db) {
        try {
          await db.insert(hedera_anchors).values({
            id: anchorId,
            recordId: payload.recordId || null,
            credentialId: payload.credentialId || null,
            payloadHash,
            network,
            topicId: effectiveTopicId,
            transactionId: null,
            consensusTimestamp: null,
            status: 'NOT_AVAILABLE',
            provider: 'HEDERA_HCS',
            attemptCount: 0,
            errorCode: 'CREDENTIALS_MISSING',
            errorMessage: 'HEDERA_OPERATOR_KEY or HEDERA_OPERATOR_ID not present in runtime environment.',
            metadata: payload.metadata || {},
            createdBy: userId || 'system',
          });
          result.persistedToDb = true;
        } catch (dbErr: any) {
          console.warn('[HederaAnchorProvider] Failed to persist NOT_AVAILABLE anchor record:', dbErr.message);
        }
      }

      return result;
    }

    // 3. Live @hashgraph/sdk Submission with Operator Credentials
    let attemptCount = 1;
    try {
      // Dynamic import to support clean startup across environments
      const { Client, TopicMessageSubmitTransaction, TopicId, PrivateKey, AccountId } = await import('@hashgraph/sdk');

      const operatorId = process.env.HEDERA_OPERATOR_ID!;
      const operatorKey = process.env.HEDERA_OPERATOR_KEY!;

      let client: any;
      if (network === 'mainnet') {
        client = Client.forMainnet();
      } else if (network === 'previewnet') {
        client = Client.forPreviewnet();
      } else {
        client = Client.forTestnet();
      }

      client.setOperator(
        AccountId.fromString(operatorId),
        PrivateKey.fromStringECDSA ? PrivateKey.fromStringECDSA(operatorKey) : PrivateKey.fromString(operatorKey)
      );

      const messageJson = JSON.stringify({
        schema: 'rupaykg:hcs:v3',
        integrityHash: payloadHash,
        eventType: payload.eventType,
        recordId: payload.recordId,
        credentialId: payload.credentialId,
        timestamp: new Date().toISOString(),
      });

      const tx = new TopicMessageSubmitTransaction()
        .setTopicId(TopicId.fromString(effectiveTopicId))
        .setMessage(messageJson);

      const response = await tx.execute(client);
      const record = await response.getRecord(client);
      const receipt = record.receipt;
      const txId = response.transactionId ? response.transactionId.toString() : null;
      const consensusTimestamp = record.consensusTimestamp ? record.consensusTimestamp.toString() : null;
      if (!consensusTimestamp) throw new Error("Did not receive a consensus timestamp from network");

      const successResult: HederaSubmitResult = {
        id: anchorId,
        status: 'CONSENSUS_CONFIRMED',
        transactionId: txId,
        consensusTimestamp,
        topicId: effectiveTopicId,
        network,
        integrityHash: payloadHash,
        attemptCount,
        isSimulated: false,
        message: `Successfully anchored payload to Hedera Topic ${effectiveTopicId} with transaction ${txId}.`,
        persistedToDb: false
      };

      if (db) {
        try {
          await db.insert(hedera_anchors).values({
            id: anchorId,
            recordId: payload.recordId || null,
            credentialId: payload.credentialId || null,
            payloadHash,
            network,
            topicId: effectiveTopicId,
            transactionId: txId,
            consensusTimestamp,
            status: 'CONSENSUS_CONFIRMED',
            provider: 'HEDERA_HCS',
            attemptCount,
            lastAttemptAt: new Date(),
            confirmedAt: new Date(),
            metadata: {
              ...(payload.metadata || {}),
              sequenceNumber: receipt.topicSequenceNumber ? receipt.topicSequenceNumber.toString() : null,
              runningHash: receipt.topicRunningHash ? Buffer.from(receipt.topicRunningHash).toString('hex') : null,
            },
            createdBy: userId || 'system',
          });
          successResult.persistedToDb = true;
        } catch (dbErr: any) {
          console.warn('[HederaAnchorProvider] Failed to persist CONFIRMED anchor record:', dbErr.message);
        }
      }

      return successResult;
    } catch (err: any) {
      console.error('[HederaAnchorProvider] Live Hedera submission failed:', err.message);

      const isRetryable =
        err.message?.includes('BUSY') ||
        err.message?.includes('TIMEOUT') ||
        err.message?.includes('PLATFORM_TRANSACTION_NOT_CREATED');

      const failedResult: HederaSubmitResult = {
        id: anchorId,
        status: isRetryable ? 'RETRYABLE_FAILURE' : 'FAILED',
        transactionId: null,
        consensusTimestamp: null,
        topicId: effectiveTopicId,
        network,
        integrityHash: payloadHash,
        attemptCount,
        isSimulated: false,
        message: `Hedera HCS live submission failed: ${err.message}`,
        persistedToDb: false
      };

      if (db) {
        try {
          await db.insert(hedera_anchors).values({
            id: anchorId,
            recordId: payload.recordId || null,
            credentialId: payload.credentialId || null,
            payloadHash,
            network,
            topicId: effectiveTopicId,
            transactionId: null,
            consensusTimestamp: null,
            status: failedResult.status,
            provider: 'HEDERA_HCS',
            attemptCount,
            lastAttemptAt: new Date(),
            errorCode: err.code || 'HEDERA_SUBMIT_ERROR',
            errorMessage: err.message,
            metadata: payload.metadata || {},
            createdBy: userId || 'system',
          });
          failedResult.persistedToDb = true;
        } catch (dbErr: any) {
          console.warn('[HederaAnchorProvider] Failed to persist FAILED anchor record:', dbErr.message);
        }
      }

      return failedResult;
    }
  }

  /**
   * Verify an anchor against the live Hedera Mirror Node
   */
  public static async verifyAnchorOnMirrorNode(
    transactionIdOrTimestamp: string,
    topicId: string = this.DEFAULT_TOPIC_ID,
    network: string = this.DEFAULT_NETWORK
  ): Promise<{
    verified: boolean;
    network: string;
    consensusTimestamp?: string;
    sequenceNumber?: number;
    runningHash?: string;
    payload?: any;
    error?: string;
  }> {
    const mirrorBase = this.getMirrorNodeEndpoint(network);
    try {
      let url = '';
      if (transactionIdOrTimestamp.includes('@') || transactionIdOrTimestamp.includes('-')) {
        // Formatted transaction ID
        const formattedTx = transactionIdOrTimestamp.replace('@', '-').replace(/\./g, '_');
        url = `${mirrorBase}/api/v1/transactions/${formattedTx}`;
      } else {
        // Timestamp or query topic messages
        url = `${mirrorBase}/api/v1/topics/${topicId}/messages?limit=25&order=desc`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        return {
          verified: false,
          network,
          error: `Hedera Mirror Node responded with HTTP ${response.status}`
        };
      }

      const data: any = await response.json();
      if (data.messages && Array.isArray(data.messages)) {
        const found = data.messages.find(
          (m: any) =>
            m.consensus_timestamp === transactionIdOrTimestamp ||
            m.sequence_number === Number(transactionIdOrTimestamp)
        );

        if (found) {
          let decoded: any = null;
          try {
            decoded = JSON.parse(Buffer.from(found.message, 'base64').toString('utf8'));
          } catch {
            decoded = Buffer.from(found.message, 'base64').toString('utf8');
          }

          return {
            verified: true,
            network,
            consensusTimestamp: found.consensus_timestamp,
            sequenceNumber: found.sequence_number,
            runningHash: found.running_hash,
            payload: decoded
          };
        }
      }

      return {
        verified: false,
        network,
        error: 'Anchor message not found in mirror node recent stream window.'
      };
    } catch (err: any) {
      return {
        verified: false,
        network,
        error: `Mirror Node network error: ${err.message}`
      };
    }
  }

  /**
   * Verify an integrity hash against local or mirror-node records
   */
  public static verifyIntegrityHash(payload: any, expectedHash: string): boolean {
    const computed = this.computePayloadHash(payload);
    return computed === expectedHash;
  }
}
