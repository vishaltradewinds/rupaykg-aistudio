# RupayKg Carbon OS Migration Matrix

| Component | Status | Description |
|-----------|--------|-------------|
| **Frontend Framework** | REUSE | Continue using React 19, Vite, Tailwind, Recharts. Integrate Carbon OS views into the existing SPA. |
| **Backend Framework** | REUSE | Continue using Express.js. Add `/api/v1/carbon/*` routes. |
| **Database (PostgreSQL)** | REUSE | Expand existing Drizzle ORM schema to include Carbon OS tables (projects, methodologies, calculations, etc.). |
| **Authentication** | REUSE | Use existing Firebase Auth / JWT. Expand `role` enums in `users` table to include `PROJECT_OWNER`, `AUDITOR`, etc. |
| **Waste Ledger (Records)** | ADAPT | Existing `records` table will act as the source for eligible carbon projects. Link waste transactions to Carbon OS MRV datasets. |
| **MRV Functionality** | ADAPT | Enhance existing `mrvStatus` and `evidenceUrls` into a full versioned Evidence Engine and MRV dataset linkage. |
| **Carbon Engine** | REPLACE | Replace basic `cccAmountKg` logic with the new deterministic Methodology Rules Engine (BM WA03.001 / BM WA03.002). |
| **ACVA Workflow** | NEW | Introduce dedicated validation and verification endpoints and interfaces for ACVA users. |
| **PDD Generator** | NEW | Add version-controlled PDD generation driven by methodology parameters. |
| **GIS Integration** | ADAPT | Use existing Leaflet/PostGIS capabilities to store and query project boundaries and waste origins. |
| **Hedera Guardian** | MERGE | Adapt external registry API placeholders to interact with the new Certificate Engine lifecycle. |
| **Methodology Registry** | NEW | Create a formalized, version-controlled module for BEE methodologies (BM WA03.001, etc.). |
| **Calculation Engine** | NEW | Implement the `CarbonCalculationEngine` separate from UI components, using strict methodology parameters. |
| **AI Assistants** | ADAPT | Restrict AI from making final carbon calculation or certification decisions. Use strictly for OCR, extraction, and drafting. |
