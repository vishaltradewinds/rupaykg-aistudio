# RupayKg Enterprise 3.0 — UI/UX Consolidation Contract

## Purpose

This document defines the surgical UI/UX consolidation required after the production-hardening audit. It is a design contract, not a license to rewrite working modules.

## Canonical information architecture

- Operations
  - Urban Operations
  - Rural Operations
  - Ground Reality
- Compliance
  - SWM Compliance
  - LGD Directory
  - Compliance Reports
- Carbon & MRV
  - Carbon / CCTS
  - MRV
- Trust & Verification
  - Hedera / Guardian
  - Verifiable Credentials
  - Verification
- Administration
  - Users & Organizations
  - Settings

## Consolidation rules

1. Existing production capabilities must remain intact.
2. Do not create parallel implementations of an existing capability.
3. A verification action must have one canonical implementation; other screens invoke it rather than reimplement it.
4. LGD lookup must have one canonical UI component and service contract.
5. LGD data from the local application index must never be labelled as Government LGD Verified.
6. Use these LGD states consistently:
   - Government LGD Verified
   - Local Index — Not Government Verified
   - Verification Unavailable
   - Verification Conflict
7. A locally generated identifier must be labelled `RupayKg Local Reference ID`, never `Official LGD Code`.
8. Do not remove legitimate domain modules merely because their workflows overlap.
9. Do not alter authentication, database, Hedera, VC, or MRV architecture as part of this UX consolidation.
10. Do not add mock, synthetic, or fallback regulatory evidence.
11. Before any UI change is merged, run the repository's full lint/typecheck, build, persistence, P0, P1, P2, and certification suites.

## Freeze rule

This is a surgical UX consolidation only. No visual redesign, new feature, backend refactor, or speculative cleanup is authorized under this document.
