const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// I will remove the stray code block by regex.
// The stray block is from `    }` after `  });` at line 3410 down to `  });` at line 3446.
code = code.replace(/app\.post\("\/api\/v1\/guardian\/authority", async \(req, res\) => \{\n    return res\.status\(403\)[\s\S]*?\}\);\n    \}\n\n    const fingerprint = crypto\.createHash[\s\S]*?res\.json\(\{\n      success: true,[\s\S]*?\}\);\n  \}\);/m, 
`app.post("/api/v1/guardian/authority", async (req, res) => {
    return res.status(403).json({ error: "Guardian authority initialization is restricted to deployment-time secrets or secure administrative bootstrap. Remote provisioning is disabled in production." });
  });`);

fs.writeFileSync('server.ts', code);
console.log("Syntax fixed");
