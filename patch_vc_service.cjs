const fs = require('fs');
let code = fs.readFileSync('src/services/vcService.ts', 'utf8');

const regex = /"compliance": \{\n          "standard": "ISO 14064-3 Readiness",\n          "methaneProtocol": "IPCC Tier 1 Diversion Model",\n          "auditability": "Full Stakeholder Chain Verification"\n        \}/;

const replacement = `"compliance": {
          "standard": record.verification_standard || "ISO 14064-3 Readiness",
          "methaneProtocol": "IPCC Tier 1 Diversion Model",
          "auditability": "Full Stakeholder Chain Verification",
          "icm_methodology_id": record.icm_methodology_id || undefined,
          "ccts_sector": record.ccts_sector || undefined,
          "acva_id": record.acva_id || undefined
        }`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/services/vcService.ts', code);
console.log("vcService patched for ICM");
