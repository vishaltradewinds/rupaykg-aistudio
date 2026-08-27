const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/app\.post\("\/api\/carbon\/guardian\/broadcast-test", async \(req, res\) => \{\n    return res\.status\(503\)\.json\(\{ error: "Simulated Hedera broadcast is disabled in production\." \}\);\n  \}\);\n    \} catch \(err: any\) \{\n      res\.status\(500\)\.json\(\{ error: "Failed to broadcast HCS test message", details: err\.message \}\);\n    \}\n  \}\);/m, 
`app.post("/api/carbon/guardian/broadcast-test", async (req, res) => {
    return res.status(503).json({ error: "Simulated Hedera broadcast is disabled in production." });
  });`);

code = code.replace(/app\.post\("\/api\/carbon\/guardian\/sync-ledger", async \(req, res\) => \{\n    return res\.status\(503\)\.json\(\{ error: "Simulated Hedera ledger sync is disabled in production\." \}\);\n  \}\);\n    \} catch \(err: any\) \{\n      res\.status\(500\)\.json\(\{ error: "Failed to sync Hedera Consensus Service ledger batch", details: err\.message \}\);\n    \}\n  \}\);/m, 
`app.post("/api/carbon/guardian/sync-ledger", async (req, res) => {
    return res.status(503).json({ error: "Simulated Hedera ledger sync is disabled in production." });
  });`);

fs.writeFileSync('server.ts', code);
console.log("Syntax 3 fixed");
