const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The block starts at `app.post("/api/carbon/guardian/verify-chain"`
code = code.replace(/app\.post\("\/api\/carbon\/guardian\/verify-chain", async \(req, res\) => \{\n    return res\.status\(503\)\.json\(\{ error: "Simulated Hedera chain verification is disabled in production\." \}\);\n  \}\);\n    \}\);\n\n    res\.json\(\{[\s\S]*?\}\);\n  \}\);/m, 
`app.post("/api/carbon/guardian/verify-chain", async (req, res) => {
    return res.status(503).json({ error: "Simulated Hedera chain verification is disabled in production." });
  });`);

fs.writeFileSync('server.ts', code);
console.log("Syntax 2 fixed");
