const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// We need to replace the POST /api/v1/guardian/authority with a strict 403 or server-side config initialization.
code = code.replace(/app\.post\("\/api\/v1\/guardian\/authority"[\s\S]*?\}\);/m, 
`app.post("/api/v1/guardian/authority", async (req, res) => {
    return res.status(403).json({ error: "Guardian authority initialization is restricted to deployment-time secrets or secure administrative bootstrap. Remote provisioning is disabled in production." });
  });`);

code = code.replace(/app\.get\("\/api\/v1\/guardian\/authority"[\s\S]*?\}\);/m,
`app.get("/api/v1/guardian/authority", async (req, res) => {
    if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
      return res.status(503).json({ success: false, error: "Guardian authority not configured. Missing HEDERA_OPERATOR_ID or HEDERA_OPERATOR_KEY." });
    }
    const fingerprint = crypto.createHash('sha256').update(process.env.HEDERA_OPERATOR_ID).digest('hex').substring(0, 16);
    const did = \`did:hedera:testnet:\${fingerprint};rupaykg-authority\`;
    res.json({ success: true, hederaAccountId: process.env.HEDERA_OPERATOR_ID, did, status: "Configured from deployment secrets" });
  });`);

// Fix Math.random() simulated consensus timestamp and tx generation in carbon endpoints
// like /api/v1/policies/:policy_id/blocks/:block_id
code = code.replace(/app\.post\("\/api\/v1\/policies\/:policy_id\/blocks\/:block_id"[\s\S]*?res\.json\(\{[\s\S]*?\}\);[\s\S]*?\}\);/m, 
`app.post("/api/v1/policies/:policy_id/blocks/:block_id", async (req, res) => {
    return res.status(503).json({ error: "SIMULATED evidence generation disabled in production. A real Guardian/Hedera provider is required." });
  });`);

code = code.replace(/app\.post\("\/api\/carbon\/guardian\/broadcast-test"[\s\S]*?\}\);/m,
`app.post("/api/carbon/guardian/broadcast-test", async (req, res) => {
    return res.status(503).json({ error: "Simulated Hedera broadcast is disabled in production." });
  });`);

code = code.replace(/app\.post\("\/api\/carbon\/guardian\/sync-ledger"[\s\S]*?\}\);/m,
`app.post("/api/carbon/guardian/sync-ledger", async (req, res) => {
    return res.status(503).json({ error: "Simulated Hedera ledger sync is disabled in production." });
  });`);

code = code.replace(/app\.post\("\/api\/carbon\/guardian\/verify-chain"[\s\S]*?\}\);/m,
`app.post("/api/carbon/guardian/verify-chain", async (req, res) => {
    return res.status(503).json({ error: "Simulated Hedera chain verification is disabled in production." });
  });`);
  
code = code.replace(/app\.post\("\/api\/swm\/weighbridge\/slip"[\s\S]*?\}\);/m,
`app.post("/api/swm/weighbridge/slip", async (req, res) => {
    return res.status(503).json({ error: "Simulated weighbridge evidence generation is disabled in production." });
  });`);

code = code.replace(/app\.post\("\/api\/swm\/cpcb\/sync"[\s\S]*?\}\);/m,
`app.post("/api/swm/cpcb/sync", async (req, res) => {
    return res.status(503).json({ error: "Simulated CPCB token generation is disabled in production." });
  });`);

fs.writeFileSync('server.ts', code);
console.log("Trust boundary patches applied");
