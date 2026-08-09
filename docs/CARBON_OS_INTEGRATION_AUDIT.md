# RupayKg Carbon OS Integration Audit

## 1. Frontend Framework
React (v19) with Vite, Tailwind CSS, Lucide React for icons, Recharts for charts, Leaflet for maps, Zustand for state management, framer-motion for animations.

## 2. Backend Framework
Express.js (v4.21.2) running on Node.js. Used as an API server and serves static files in production. Includes middleware like CORS, Express Rate Limit, Helmet.

## 3. Database
- **PostgreSQL**: Used with Drizzle ORM. Current schema contains `users` and `records` (waste transactions).
- **MongoDB**: Used via Mongoose (v9.6.2).
- **SQLite**: Local caching via `better-sqlite3` (LGD directory).
- **Redis**: Caching and session management via `redis` (v5.12.1).

## 4. Authentication
Firebase Auth integration (`uid` column in the `users` table). JSON Web Tokens (`jsonwebtoken`) are used for internal/API route protection and role-based access control.

## 5. API Architecture
RESTful API built with Express. Routes are currently defined in `server.ts` or separated in controllers. Follows a `/api/*` structure.

## 6. Existing Waste Domain
Waste records are tracked in the `records` table with properties like `wasteType`, `weightKg`, `status`, `totalValue`, etc. The waste domains support transaction creation and history.

## 7. Existing MRV Functionality
The `records` table includes `mrvStatus` and `mrvVerifiedBy` fields, as well as `evidenceUrls`.

## 8. Existing Carbon Functionality
`cccAmountKg` and `potentialCccValue` exist on `records`. Basic integration points for carbon valuation.

## 9. Existing EPR Functionality
Stakeholder mapping via `role` (Producer, Recycler, etc.) in the `users` table, supporting EPR compliance reporting (inferred from components).

## 10. Existing GIS
Maps and spatial data are supported using Leaflet (`react-leaflet`) and D3 for visualizations. LGD directory service maps villages, subdistricts, districts, states.

## 11. Existing Marketplace
Waste tokenization or basic marketplace functionality integrated via UI components (`components/Marketplace.tsx` or similar), relying on `records`.

## 12. Existing Dashboards
Multi-tenant/multi-role dashboards available for citizens, officials, and different stakeholders using Recharts.

## 13. Existing Integrations
- Hedera Guardian (`@hashgraph/sdk`)
- Gemini API (`@google/genai`) for risk assessment/AI tips.
- Carbon Registry API (placeholder via `.env.example`).
- Firebase Auth.

## 14. Deployment Architecture
Dockerfile for containerized deployment, built with `esbuild` to compile `server.ts` to `dist/server.cjs` and Vite to build the React SPA in `dist/`. Suitable for Google Cloud Run / Docker environments.

## 15. Environment Variables
Defined in `.env.example`: `MONGO_URI`, `GEMINI_API_KEY`, `CARBON_REGISTRY_API_URL`, `GUARDIAN_API_URL`, etc., `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`.

## 16. Existing Tests
No extensive explicit testing suites (like Jest/Vitest) visible in the immediate `package.json` aside from typescript linting (`tsc --noEmit`).

## 17. Existing Database Schema
- **users**: `id`, `uid`, `email`, `role`, `name`, `phone`, `state`, `district`, `subdistrict`, `local_area`, `village`, `organization_name`, `wallet_balance`, `createdAt`.
- **records**: `id`, `userId`, `wasteType`, `weightKg`, `village`, `status`, `mrvStatus`, `mrvVerifiedBy`, `totalValue`, `cccAmountKg`, `potentialCccValue`, `riskScore`, `evidenceUrls`, `timestamp`.

## 18. Existing API Routes
- Routes defined inside `server.ts`, handling AI `/api/ai/generate`, blockchain operations, LGD sync, and waste records management.
