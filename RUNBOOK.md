# RUPAYKG ENTERPRISE 3.0 — LIVE INTEGRATION RUNBOOK

## A. Secret Names Required
The following secrets must be provisioned in Google Secret Manager:
1. `HEDERA_NETWORK`
2. `HEDERA_TOPIC_ID`
3. `HEDERA_OPERATOR_ID`
4. `HEDERA_OPERATOR_KEY`
5. `VC_ISSUER_DID`
6. `VC_ISSUER_PRIVATE_KEY`
7. `VC_ISSUER_PUBLIC_KEY`

## B. Cloud Run Bindings Required
The Cloud Run deployment must map the above Secret Manager secrets as Environment Variables to the container instances.
- Map `HEDERA_OPERATOR_KEY` -> Environment variable `HEDERA_OPERATOR_KEY`
- Map `VC_ISSUER_PRIVATE_KEY` -> Environment variable `VC_ISSUER_PRIVATE_KEY`
*(Map the remainder analogously).*

## C. Required IAM Permissions
The Compute Service Account attached to the Cloud Run service must have the following IAM role explicitly granted on the secrets (or at the project level):
- `roles/secretmanager.secretAccessor` (Secret Manager Secret Accessor)

## D. Hedera Testnet Prerequisites
1. An active account on the Hedera Developer Portal (portal.hedera.com).
2. A funded Testnet Account ID (e.g., `0.0.123456`).
3. The matching ED25519 or ECDSA Private Key in DER hex format.
4. An existing HCS (Hedera Consensus Service) Topic ID created on the testnet.

## E. VC Key Prerequisites
1. A valid asymmetric keypair generated for signing (e.g., Ed25519 or RS256) encoded in PEM format.
2. A valid DID (Decentralized Identifier) string for the issuer (e.g., `did:rupaykg:issuer:001`).

## F. Exact Safe Commands/Checks to Verify Configuration WITHOUT Exposing Secrets
Run the following node script in the container environment or Cloud Run exec shell to safely verify presence:
```bash
node -e "
console.log('--- Configuration Status ---');
console.log('HEDERA_NETWORK:', process.env.HEDERA_NETWORK || 'MISSING');
console.log('HEDERA_TOPIC_ID:', process.env.HEDERA_TOPIC_ID || 'MISSING');
console.log('HEDERA_OPERATOR_ID:', process.env.HEDERA_OPERATOR_ID || 'MISSING');
console.log('HEDERA_OPERATOR_KEY:', process.env.HEDERA_OPERATOR_KEY ? 'PRESENT (HIDDEN)' : 'MISSING');
console.log('VC_ISSUER_DID:', process.env.VC_ISSUER_DID || 'MISSING');
console.log('VC_ISSUER_PUBLIC_KEY:', process.env.VC_ISSUER_PUBLIC_KEY ? 'PRESENT (HIDDEN)' : 'MISSING');
console.log('VC_ISSUER_PRIVATE_KEY:', process.env.VC_ISSUER_PRIVATE_KEY ? 'PRESENT (HIDDEN)' : 'MISSING');
"
```

## G. Exact Commands to Execute the Live Hedera Test
```bash
# This suite will attempt to submit a live anchor to Hedera HCS
npm run test:cert
```

## H. Exact Commands to Execute the Live VC Signing Test
```bash
# This suite will issue a live VC credential and mathematically verify its cryptographic signature
npm run test:cert
```

## I. Exact Evidence Required to Promote YELLOW → GREEN
To achieve full GREEN certification, an operator must provide:
1. Proof of configuration: Output of the safe check (F) showing all secrets as `PRESENT`.
2. Proof of consensus: A test log from `npm run test:cert` showing Hedera anchor `status: CONSENSUS_CONFIRMED` with a valid, non-null Hedera `transactionId`.
3. Proof of signature: A test log from `npm run test:cert` showing VC verification with `isValid: true`, a valid asymmetric cryptographic signature, and no fallback to purely local SHA-256 hashes.
4. Proof of regression: 30/30 tests consistently pass in the fully integrated environment.
