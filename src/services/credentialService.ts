import crypto from 'crypto';

export type CredentialProofStatus = 'NOT_AVAILABLE' | 'INTEGRITY_HASH_ONLY' | 'SIGNED' | 'VERIFIED' | 'FAILED';

export interface CredentialIssuanceResult {
  credentialId: string;
  issuerId: string;
  issuanceDate: string;
  proofType: 'LOCAL_SHA256_DIGEST' | 'ED25519_SIGNATURE_2020';
  proofStatus: CredentialProofStatus;
  integrityHash: string;
  signature: string | null;
  publicKey: string | null;
  isSimulated: false;
  message: string;
}

export interface CredentialVerificationResult {
  isValid: boolean;
  proofStatus: CredentialProofStatus;
  integrityDigestMatch: boolean;
  signatureVerified: boolean;
  guardianPolicyStatus: 'NOT_AVAILABLE' | 'ACTIVE';
  message: string;
}

/**
 * W3C Verifiable Credential & Guardian Architecture Boundary
 * - Distinctly classifies local cryptographic digests (SHA-256) as INTEGRITY_HASH_ONLY.
 * - Does NOT claim asymmetric digital signature or W3C VC proof without a loaded asymmetric private key.
 * - Guardian policy execution without a live Guardian node is reported as NOT_AVAILABLE.
 */
export class CredentialService {
  /**
   * Issue a credential package with explicit proof status
   */
  public static issueCredential(
    subject: {
      id: string;
      claims: Record<string, any>;
    },
    issuer: {
      id: string;
      name: string;
    } = { id: 'did:rupaykg:issuer:001', name: 'RupayKg Circular OS Authority' }
  ): CredentialIssuanceResult {
    const credentialId = `urn:uuid:${crypto.randomUUID()}`;
    const issuanceDate = new Date().toISOString();

    const payload = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: credentialId,
      type: ['VerifiableCredential', 'CircularEconomyActivityCredential'],
      issuer: issuer.id,
      issuanceDate,
      credentialSubject: subject
    };

    const integrityHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');

    // Cryptographic signature check: private key for ED25519 / RS256 VC signature
    const hasVcSigningKey = Boolean(process.env.VC_ISSUER_PRIVATE_KEY);

    if (!hasVcSigningKey) {
      return {
        credentialId,
        issuerId: issuer.id,
        issuanceDate,
        proofType: 'LOCAL_SHA256_DIGEST',
        proofStatus: 'INTEGRITY_HASH_ONLY',
        integrityHash,
        signature: null,
        publicKey: null,
        isSimulated: false,
        message: 'Credential created with cryptographic SHA-256 integrity hash. Asymmetric W3C VC digital signature is NOT_AVAILABLE (requires VC_ISSUER_PRIVATE_KEY).'
      };
    }

    return {
      credentialId,
      issuerId: issuer.id,
      issuanceDate,
      proofType: 'LOCAL_SHA256_DIGEST',
      proofStatus: 'INTEGRITY_HASH_ONLY',
      integrityHash,
      signature: null,
      publicKey: null,
      isSimulated: false,
      message: 'Cryptographic signature key unavailable.'
    };
  }

  /**
   * Verify credential integrity
   */
  public static verifyCredential(
    payload: any,
    claimedIntegrityHash: string
  ): CredentialVerificationResult {
    const computedHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const integrityDigestMatch = computedHash === claimedIntegrityHash;

    return {
      isValid: integrityDigestMatch,
      proofStatus: integrityDigestMatch ? 'INTEGRITY_HASH_ONLY' : 'FAILED',
      integrityDigestMatch,
      signatureVerified: false,
      guardianPolicyStatus: 'NOT_AVAILABLE',
      message: integrityDigestMatch
        ? 'Payload matches SHA-256 integrity hash. Asymmetric signature and Guardian node verification are NOT_AVAILABLE.'
        : 'Integrity hash mismatch: payload data has been altered.'
    };
  }
}
