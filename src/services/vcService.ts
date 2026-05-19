import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// ========================================================
// W3C VERIFIABLE CREDENTIALS 2.0 SERVICE
// ========================================================

/**
 * VC Model following W3C Credentials Data Model v2.0
 * Conforms to Linked Data (JSON-LD) principles for VVB interoperability.
 */

export interface VerifiableCredential {
  "@context": string[];
  id: string;
  type: string[];
  issuer: string;
  validFrom: string;
  credentialSubject: any;
  proof?: any;
}

export class VCService {
  /**
   * Generates a W3C Verifiable Credential 2.0 compliant data structure
   * for a waste-to-carbon event.
   */
  static generateWasteCarbonVC(record: any, carbonEvent: any): VerifiableCredential {
    const vcId = `urn:uuid:${uuidv4()}`;
    const timestamp = new Date().toISOString();

    const vc: VerifiableCredential = {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://rupaykg.org/contexts/waste-carbon/v2" 
      ],
      "id": vcId,
      "type": ["VerifiableCredential", "CarbonReductionCredential", "WasteManagementCredential"],
      "issuer": "https://rupaykg.org/issuers/national-compliance-ai",
      "validFrom": timestamp,
      "credentialSubject": {
        "id": `did:rupaykg:event:${record.id}`,
        "type": "WasteDiversionActivity",
        "wasteDetails": {
          "type": record.waste_type,
          "weight": {
            "value": record.weight_kg,
            "unit": "kg"
          },
          "geoPoint": {
            "latitude": record.geo_lat || 0,
            "longitude": record.geo_long || 0
          },
          "timestamp": record.timestamp || timestamp
        },
        "carbonMetrics": {
          "netReduction": {
            "value": parseFloat(carbonEvent.net_carbon_reduction_kg_co2e.toFixed(4)),
            "unit": "kgCO2e"
          },
          "methaneAvoidance": {
            "value": parseFloat(carbonEvent.methane_estimate_kg_co2e.toFixed(4)),
            "unit": "kgCO2e"
          },
          "landfillDiversion": {
            "value": parseFloat(carbonEvent.diversion_estimate_kg_co2e.toFixed(4)),
            "unit": "kgCO2e"
          }
        },
        "mrvEvidence": {
          "mrvScore": parseFloat(carbonEvent.mrv_score.toFixed(2)),
          "stakeholders": carbonEvent.stakeholder_chain || [],
          "digitalTwinId": carbonEvent.id
        },
        "compliance": {
          "standard": "ISO 14064-3 Readiness",
          "methaneProtocol": "IPCC Tier 1 Diversion Model",
          "auditability": "Full Stakeholder Chain Verification"
        }
      }
    };

    // Data Integrity Proof (Deterministic SHA256 of the JCS representation)
    // Note: In strict W3C, this would use a proper Ed25519 signature
    const canonicalString = JSON.stringify(vc);
    const hmac = crypto.createHash('sha256').update(canonicalString).digest('hex');

    vc.proof = {
      "type": "DataIntegrityProof",
      "cryptosuite": "sha256-hex-digest-2024",
      "created": timestamp,
      "verificationMethod": "https://rupaykg.org/issuers/national-compliance-ai/keys/v1",
      "proofPurpose": "assertionMethod",
      "proofValue": hmac
    };

    return vc;
  }

  /**
   * Provides the JSON-LD Context definition for the custom RupayKg namespace
   */
  static getWasteCarbonContext() {
    return {
      "@context": {
        "@version": 1.1,
        "rupaykg": "https://rupaykg.org/ns/waste#",
        "carbon": "https://rupaykg.org/ns/carbon#",
        "WasteDiversionActivity": "rupaykg:WasteDiversionActivity",
        "wasteDetails": "rupaykg:details",
        "carbonMetrics": "carbon:metrics",
        "netReduction": "carbon:netReduction",
        "methaneAvoidance": "carbon:methaneAvoidance",
        "landfillDiversion": "carbon:landfillDiversion",
        "mrvEvidence": "rupaykg:mrvEvidence",
        "mrvScore": "rupaykg:mrvScore",
        "weight": "rupaykg:weight",
        "kg": "rupaykg:kg",
        "kgCO2e": "carbon:kgCO2e"
      }
    };
  }
}
