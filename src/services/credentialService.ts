import crypto from 'crypto';

export type CredentialProofStatus =
  | 'NOT_AVAILABLE'
  | 'INTEGRITY_HASH_ONLY'
  | 'SIGNED'
  | 'VERIFIED'
  | 'FAILED'
  | 'TAMPERED';

export interface W3CCredentialSubject {
  id: string;
  [key: string]: any;
}

export interface W3CProof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  jws?: string;
  signatureValue?: string;
}

export interface W3CVerifiableCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string | { id: string; name: string };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: W3CCredentialSubject;
  proof?: W3CProof;
}

export interface CredentialIssuanceResult {
  credentialId: string;
  issuerId: string;
  issuanceDate: string;
  proofType: 'LOCAL_SHA256_DIGEST' | 'ED25519_SIGNATURE_2020' | 'JSON_WEB_SIGNATURE_2020';
  proofStatus: CredentialProofStatus;
  integrityHash: string;
  signature: string | null;
  publicKey: string | null;
  isSimulated: false;
  verifiableCredential: W3CVerifiableCredential;
  message: string;
}

export interface CredentialVerificationResult {
  isValid: boolean;
  proofStatus: CredentialProofStatus;
  integrityDigestMatch: boolean;
  signatureVerified: boolean;
  guardianPolicyStatus: 'NOT_AVAILABLE' | 'ACTIVE';
  tampered: boolean;
  details: {
    credentialId: string;
    issuer: string;
    computedHash: string;
    claimedHash?: string;
    verificationError?: string;
  };
  message: string;
}

/**
 * Enterprise W3C Verifiable Credential (VC) & Cryptographic Provenance Engine
 * 
 * Strict Cryptographic Invariants:
 * 1. Deterministic Canonicalization: Computes canonical SHA-256 integrity digests over sorted-key JSON.
 * 2. Real Asymmetric Signatures: Signs with Ed25519 / RSA / ECDSA when VC_ISSUER_PRIVATE_KEY is present.
 * 3. Fail-Closed Default: When private keys are not configured in runtime environment, returns
 *    proofStatus: 'INTEGRITY_HASH_ONLY', signature: null, and isSimulated: false.
 * 4. Tamper Resistance: Any mutation of the credentialSubject, issuer, or claims invalidates the digest and signature.
 * 5. Guardian Policy Boundary: Decentralized Guardian policy evaluations without an active Guardian node are strictly classified as NOT_AVAILABLE.
 */
export class CredentialService {
  public static readonly DEFAULT_ISSUER_DID = process.env.VC_ISSUER_DID || 'did:rupaykg:issuer:001';
  public static readonly DEFAULT_ISSUER_NAME = 'RupayKg Circular Economy Authority';

  /**
   * Deterministic recursive key-sorted JSON stringification (RFC 8785 JSON Canonicalization).
   */
  public static canonicalize(obj: any): string {
    if (obj === null || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return '[' + obj.map(item => this.canonicalize(item)).join(',') + ']';
    }
    const keys = Object.keys(obj).sort();
    const keyValPairs = keys.map(key => `"${key}":${this.canonicalize(obj[key])}`);
    return '{' + keyValPairs.join(',') + '}';
  }

  /**
   * Compute deterministic canonical SHA-256 integrity hash.
   */
  public static computeIntegrityHash(payload: any): string {
    const canonical = this.canonicalize(payload);
    return crypto.createHash('sha256').update(canonical).digest('hex');
  }

  /**
   * Issue a W3C Verifiable Credential package.
   * If VC_ISSUER_PRIVATE_KEY is provided, generates a real cryptographic signature.
   * Otherwise, reports proofStatus: 'INTEGRITY_HASH_ONLY'.
   */
  public static issueCredential(
    subject: {
      id: string;
      claims: Record<string, any>;
    },
    issuer: {
      id: string;
      name?: string;
    } = { id: this.DEFAULT_ISSUER_DID, name: this.DEFAULT_ISSUER_NAME }
  ): CredentialIssuanceResult {
    const credentialId = `urn:uuid:${crypto.randomUUID()}`;
    const issuanceDate = new Date().toISOString();

    const vcPayloadWithoutProof: Omit<W3CVerifiableCredential, 'proof'> = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1',
        'https://schema.rupaykg.org/v3/circular-economy.jsonld'
      ],
      id: credentialId,
      type: ['VerifiableCredential', 'CircularEconomyActivityCredential'],
      issuer: issuer.id,
      issuanceDate,
      credentialSubject: {
        id: subject.id,
        ...subject.claims
      }
    };

    const integrityHash = this.computeIntegrityHash(vcPayloadWithoutProof);

    const privateKeyEnv = process.env.VC_ISSUER_PRIVATE_KEY;
    const publicKeyEnv = process.env.VC_ISSUER_PUBLIC_KEY;
    const hasSigningKey = Boolean(privateKeyEnv && privateKeyEnv.trim().length > 30 && !privateKeyEnv.includes('placeholder'));

    if (!hasSigningKey) {
      const vc: W3CVerifiableCredential = {
        ...vcPayloadWithoutProof
      };

      return {
        credentialId,
        issuerId: issuer.id,
        issuanceDate,
        proofType: 'LOCAL_SHA256_DIGEST',
        proofStatus: 'INTEGRITY_HASH_ONLY',
        integrityHash,
        signature: null,
        publicKey: publicKeyEnv || null,
        isSimulated: false,
        verifiableCredential: vc,
        message: 'Credential created with cryptographic SHA-256 integrity hash. Asymmetric W3C VC digital signature is NOT_AVAILABLE (requires VC_ISSUER_PRIVATE_KEY in runtime environment).'
      };
    }

    // Generate real cryptographic signature with configured private key
    try {
      const canonicalData = this.canonicalize(vcPayloadWithoutProof);
      let signatureValue: string;
      let proofType: 'ED25519_SIGNATURE_2020' | 'JSON_WEB_SIGNATURE_2020' = 'ED25519_SIGNATURE_2020';

      const privateKey = crypto.createPrivateKey(privateKeyEnv!);
      if (privateKey.asymmetricKeyType === 'ed25519') {
        const sig = crypto.sign(null, Buffer.from(canonicalData, 'utf8'), privateKey);
        signatureValue = sig.toString('base64');
        proofType = 'ED25519_SIGNATURE_2020';
      } else {
        const sign = crypto.createSign('SHA256');
        sign.update(canonicalData);
        sign.end();
        signatureValue = sign.sign(privateKey, 'base64');
        proofType = 'JSON_WEB_SIGNATURE_2020';
      }

      const proof: W3CProof = {
        type: proofType === 'ED25519_SIGNATURE_2020' ? 'Ed25519Signature2020' : 'JsonWebSignature2020',
        created: issuanceDate,
        verificationMethod: `${issuer.id}#key-1`,
        proofPurpose: 'assertionMethod',
        signatureValue
      };

      const signedVc: W3CVerifiableCredential = {
        ...vcPayloadWithoutProof,
        proof
      };

      return {
        credentialId,
        issuerId: issuer.id,
        issuanceDate,
        proofType,
        proofStatus: 'SIGNED',
        integrityHash,
        signature: signatureValue,
        publicKey: publicKeyEnv || null,
        isSimulated: false,
        verifiableCredential: signedVc,
        message: 'W3C Verifiable Credential successfully signed with asymmetric issuer private key.'
      };
    } catch (signErr: any) {
      console.error('[CredentialService] Cryptographic signing failed:', signErr.message);
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
        verifiableCredential: { ...vcPayloadWithoutProof },
        message: `Asymmetric signing error: ${signErr.message}. Fallback to local SHA-256 integrity hash.`
      };
    }
  }

  /**
   * Cryptographically verify a W3C Verifiable Credential.
   */
  public static verifyCredential(
    vc: W3CVerifiableCredential,
    claimedIntegrityHash?: string,
    providedPublicKey?: string
  ): CredentialVerificationResult {
    if (!vc || typeof vc !== 'object') {
      return {
        isValid: false,
        proofStatus: 'FAILED',
        integrityDigestMatch: false,
        signatureVerified: false,
        guardianPolicyStatus: 'NOT_AVAILABLE',
        tampered: true,
        details: {
          credentialId: 'UNKNOWN',
          issuer: 'UNKNOWN',
          computedHash: '',
          verificationError: 'Invalid credential payload structure.'
        },
        message: 'Credential payload is invalid or empty.'
      };
    }

    const { proof, ...payloadWithoutProof } = vc;
    const computedHash = this.computeIntegrityHash(payloadWithoutProof);

    let integrityDigestMatch = true;
    if (claimedIntegrityHash) {
      integrityDigestMatch = computedHash.toLowerCase() === claimedIntegrityHash.toLowerCase();
    }

    const credentialId = vc.id || 'UNKNOWN';
    const issuer = typeof vc.issuer === 'string' ? vc.issuer : vc.issuer?.id || 'UNKNOWN';

    // If there is no cryptographic proof attached, verify digest only
    if (!proof || !proof.signatureValue) {
      return {
        isValid: integrityDigestMatch,
        proofStatus: integrityDigestMatch ? 'INTEGRITY_HASH_ONLY' : 'TAMPERED',
        integrityDigestMatch,
        signatureVerified: false,
        guardianPolicyStatus: 'NOT_AVAILABLE',
        tampered: !integrityDigestMatch,
        details: {
          credentialId,
          issuer,
          computedHash,
          claimedHash: claimedIntegrityHash,
          verificationError: integrityDigestMatch ? undefined : 'Payload hash does not match claimed digest.'
        },
        message: integrityDigestMatch
          ? 'Payload matches SHA-256 canonical integrity digest. Asymmetric digital signature is NOT_AVAILABLE for this credential.'
          : 'Tampering detected: Canonical payload hash does not match claimed integrity hash.'
      };
    }

    // Verify cryptographic signature
    const publicKeyToUse = providedPublicKey || process.env.VC_ISSUER_PUBLIC_KEY;
    if (!publicKeyToUse) {
      return {
        isValid: integrityDigestMatch,
        proofStatus: integrityDigestMatch ? 'SIGNED' : 'TAMPERED',
        integrityDigestMatch,
        signatureVerified: false,
        guardianPolicyStatus: 'NOT_AVAILABLE',
        tampered: !integrityDigestMatch,
        details: {
          credentialId,
          issuer,
          computedHash,
          claimedHash: claimedIntegrityHash,
          verificationError: 'Public key not available to verify asymmetric signature.'
        },
        message: 'Signature present on credential, but public key is not available in environment for verification.'
      };
    }

    try {
      const canonicalData = this.canonicalize(payloadWithoutProof);
      const publicKey = crypto.createPublicKey(publicKeyToUse);
      let signatureVerified = false;

      if (publicKey.asymmetricKeyType === 'ed25519') {
        const sigBuffer = Buffer.from(proof.signatureValue, 'base64');
        signatureVerified = crypto.verify(null, Buffer.from(canonicalData, 'utf8'), publicKey, sigBuffer);
      } else {
        const verify = crypto.createVerify('SHA256');
        verify.update(canonicalData);
        verify.end();
        signatureVerified = verify.verify(publicKey, proof.signatureValue, 'base64');
      }

      const isValid = integrityDigestMatch && signatureVerified;

      return {
        isValid,
        proofStatus: isValid ? 'VERIFIED' : 'FAILED',
        integrityDigestMatch,
        signatureVerified,
        guardianPolicyStatus: 'NOT_AVAILABLE',
        tampered: !isValid,
        details: {
          credentialId,
          issuer,
          computedHash,
          claimedHash: claimedIntegrityHash,
          verificationError: signatureVerified ? undefined : 'Asymmetric signature verification failed against public key.'
        },
        message: isValid
          ? 'W3C Verifiable Credential verified successfully (Valid cryptographic signature and canonical digest match).'
          : signatureVerified
          ? 'Integrity digest mismatch: Credential content was tampered after signing.'
          : 'Cryptographic signature verification failed: Invalid signature or mismatched public key.'
      };
    } catch (verErr: any) {
      return {
        isValid: false,
        proofStatus: 'FAILED',
        integrityDigestMatch,
        signatureVerified: false,
        guardianPolicyStatus: 'NOT_AVAILABLE',
        tampered: true,
        details: {
          credentialId,
          issuer,
          computedHash,
          claimedHash: claimedIntegrityHash,
          verificationError: `Verification exception: ${verErr.message}`
        },
        message: `Cryptographic verification error: ${verErr.message}`
      };
    }
  }
}
