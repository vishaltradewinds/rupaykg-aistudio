# RupayKg Enterprise 3.0 — Production Acceptance Gate

## Purpose

This gate defines the evidence required to move the audited software baseline from CI-certified to production-accepted. A gate is **PASS only when its required real-world evidence exists**. Missing credentials, hardware, or external consensus is **UNVERIFIED**, never PASS.

## Baseline

- Repository: `vishaltradewinds/rupaykg-aistudio`
- Baseline: `main`
- Software CI gate: Production Audit must be green on the exact release candidate commit.
- Production secrets must never be committed to Git.

## Gate 1 — Software integrity

- [ ] Full Production Audit passes on release candidate SHA.
- [ ] Production build succeeds.
- [ ] Database migrations succeed against an acceptance database.
- [ ] P0/P1/P2/security and certification suites pass.
- [ ] Consolidation call-graph check passes.

**Evidence:** GitHub Actions run URL + release candidate SHA.

## Gate 2 — Hedera HCS live acceptance

Required configuration:

- `HEDERA_NETWORK`
- `HEDERA_TOPIC_ID`
- `HEDERA_OPERATOR_ID`
- `HEDERA_OPERATOR_KEY`

Procedure:

1. Use a controlled acceptance topic/account.
2. Submit one known test evidence payload through the canonical Hedera provider.
3. Capture the transaction/consensus response.
4. Independently query the topic and verify the submitted message is recoverable.
5. Verify the application records the same trace/hash and consensus reference.
6. Test missing/invalid credentials and confirm the operation fails closed without synthetic evidence.

**Pass evidence:** real consensus reference + matching application trace/hash + fail-closed negative test.

## Gate 3 — W3C Verifiable Credential live acceptance

Required configuration:

- `VC_ISSUER_DID`
- `VC_ISSUER_PRIVATE_KEY`
- `VC_ISSUER_PUBLIC_KEY`

Procedure:

1. Issue a real credential through the canonical server-side credential service.
2. Verify its signature using the configured public key.
3. Verify issuer/subject/credential integrity.
4. Tamper with a claim and confirm verification fails.
5. Confirm callers cannot provide arbitrary signing keys.
6. Confirm missing/invalid issuer configuration fails closed.

**Pass evidence:** issued credential + successful verification + tamper rejection + fail-closed negative test.

## Gate 4 — Physical weighbridge acceptance

Procedure:

1. Connect the actual supported RS232 weighbridge.
2. Capture raw serial input.
3. Verify parsing and unit normalization.
4. Record the resulting measurement through the canonical evidence path.
5. Repeat with at least one known reference weight.
6. Disconnect/unplug the device and verify the system fails safely rather than inventing a measurement.
7. Preserve raw input and resulting trace/hash where the evidence model requires it.

**Pass evidence:** device identification + raw reading + normalized reading + traceable evidence record + disconnect negative test.

## Gate 5 — Production edge and resilience acceptance

- [ ] Authentication/RBAC verified against production-like PostgreSQL.
- [ ] Redis session revocation works.
- [ ] Redis outage causes authentication to fail closed as designed.
- [ ] Rate limiting is active at the production edge/application boundary.
- [ ] TLS/HTTPS termination is configured.
- [ ] Secrets are supplied only through deployment secret management.
- [ ] Logs contain operational identifiers without leaking secrets/private keys.
- [ ] Database backup/recovery procedure is tested.
- [ ] Health/readiness behavior is verified.
- [ ] Offline mutation queue/replay behavior is tested where applicable.

**Pass evidence:** acceptance test record and deployment configuration review.

## Gate 6 — Final release certification

A release is **GREEN / Production Accepted** only when Gates 1–5 are all PASS.

Allowed states:

- `PASS` — objective evidence verified.
- `FAIL` — evidence/test failed.
- `UNVERIFIED` — required real-world evidence is unavailable.

`UNVERIFIED` must never be converted to PASS by assumption, mock success, or a deployment badge.

## Release record

Record for every production candidate:

- Release candidate SHA
- GitHub Actions audit URL
- Deployment version/revision
- Acceptance environment
- Hedera consensus reference
- VC credential verification evidence
- Weighbridge/device evidence
- Edge/resilience test evidence
- Operator/date/time
- Final gate result

## Security rule

No production private key, operator key, credential secret, or other deployment secret belongs in Git, test fixtures, logs, screenshots, or this document.
