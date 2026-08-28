import { randomBytesHex, hashStringHex } from "../utils/cryptoUtils";
import { safeParseJson } from "../utils/safeJson";

// ========================================================
// HEDERA GUARDIAN ORCHESTRATION SERVICE
// ========================================================
/**
 * Interfaces with the Hedera Guardian API.
 * Bridges W3C Verifiable Credentials with Hedera Consensus Service (HCS).
 */

export interface GuardianMessage {
  id: string;
  topicId: string;
  sequenceNumber: number;
  runningHash: string;
  message: any;
  timestamp: string;
}

export class GuardianService {
  private static HCS_TOPIC_ID = "0.0.4592011"; // Default RupayKg National Carbon Topic

  static get guardianApiUrl() {
    return process.env.GUARDIAN_API_URL;
  }

  static get guardianApiKey() {
    return process.env.GUARDIAN_API_KEY;
  }

  /**
   * Anchors a Verifiable Credential to Hedera Consensus Service (HCS) via Guardian API.
   * Fails closed if Guardian API is not configured or returns an error.
   */
  static async anchorToHCS(vc: any): Promise<GuardianMessage> {
    if (!this.guardianApiUrl) {
      throw new Error("GUARDIAN_API_URL environment variable is not configured. Guardian HCS anchoring is unavailable.");
    }

    const timestamp = new Date().toISOString();

    const response = await fetch(`${this.guardianApiUrl}/api/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.guardianApiKey ? { 'Authorization': `Bearer ${this.guardianApiKey}` } : {})
      },
      body: JSON.stringify({ document: vc })
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Guardian API error (${response.status}): ${errorText || 'Failed to anchor message'}`);
    }

    const data = await safeParseJson(response);
    if (!data || !data.id) {
      throw new Error("Guardian API returned an invalid response structure without message ID.");
    }

    const hcsMessage: GuardianMessage = {
      id: data.id,
      topicId: data.topicId || this.HCS_TOPIC_ID,
      sequenceNumber: data.sequenceNumber || 0,
      runningHash: data.runningHash || '',
      message: data.message || {
        vc_id: vc.id,
        issuer: vc.issuer,
        subject: vc.credentialSubject?.id || vc.id,
      },
      timestamp: data.timestamp || timestamp
    };

    console.log(`[Guardian] Credential ${vc.id} anchored to HCS Topic ${hcsMessage.topicId}`);
    return hcsMessage;
  }

  /**
   * Generates a DID for a physical waste processing device or stakeholder.
   */
  static generateDID(entityId: string): string {
    const fingerprint = hashStringHex(entityId).substring(0, 16);
    return `did:hedera:mainnet:${fingerprint};rupaykg-owner`;
  }

  /**
   * Retrieves a Policy Template for Waste-to-Carbon (ACM0022 / Custom)
   */
  static async getPolicyTemplate() {
    if (this.guardianApiUrl) {
      try {
        const response = await fetch(`${this.guardianApiUrl}/api/v1/policies`, {
           headers: this.guardianApiKey ? { 'Authorization': `Bearer ${this.guardianApiKey}` } : {}
        });
        if (response.ok) {
           const policies = await safeParseJson(response);
           if (policies && policies.length > 0) {
              return policies[0]; // Return the first active policy
           }
        }
      } catch (err) {
        console.error(`[Guardian] API connection failed for policies. Falling back to fallback template.`);
      }
    }

    // Local Fallback
    return {
      "policyName": "RupayKg Waste-to-Carbon Policy v2.0",
      "standards": ["ISO 14064-3", "W3C VC 2.0", "HCS v1"],
      "schemaMapping": {
        "methaneAvoidance": "https://rupaykg.org/schemas/methane-avoidance.json",
        "landfillDiversion": "https://rupaykg.org/schemas/landfill-diversion.json"
      },
      "roles": ["ISSUER", "VERIFIER", "AGGREGATOR", "MONITOR"],
      "workflow": [
        "WasteUpload -> DataLogging (HCS)",
        "MRVValidation -> Verification (VC)",
        "TrustChain -> Anchoring (HCS)",
        "Audit -> PublicLedger"
      ]
    };
  }
}

