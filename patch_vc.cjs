const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Patch issue
code = code.replace(/app\.post\("\/api\/credentials\/issue"[\s\S]*?\}\);/m,
`app.post("/api/credentials/issue", auth(["super_admin", "regulator", "auditor"]), async (req: any, res) => {
    try {
      const { subjectId, claims } = req.body;
      if (!subjectId || !claims) {
        return res.status(400).json({ error: "subjectId and claims are required to issue a credential." });
      }
      
      const serverIssuer = process.env.VC_ISSUER_DID;
      const privateKey = process.env.VC_ISSUER_PRIVATE_KEY;
      if (!serverIssuer || !privateKey) {
         return res.status(503).json({ error: "VC_ISSUER_DID or VC_ISSUER_PRIVATE_KEY not configured. Issuance is disabled." });
      }

      const result = await CredentialService.issueCredential(
        { id: subjectId, claims },
        serverIssuer
      );
      res.json({
        success: true,
        credential: result
      });
    } catch (err: any) {
      res.status(500).json({ error: "Credential issuance failed", details: err.message });
    }
  });`);

// Patch verify
code = code.replace(/app\.post\("\/api\/credentials\/verify"[\s\S]*?\}\);/m,
`app.post("/api/credentials/verify", auth(), async (req: any, res) => {
    try {
      const { credential, claimedHash } = req.body;
      if (!credential) {
        return res.status(400).json({ error: "credential object is required." });
      }
      const publicKey = process.env.VC_ISSUER_PUBLIC_KEY;
      if (!publicKey) {
         return res.status(503).json({ error: "VC_ISSUER_PUBLIC_KEY not configured. Verification is disabled." });
      }
      const verification = await CredentialService.verifyCredential(credential, claimedHash, publicKey);
      res.json({
        success: verification.isValid,
        verification
      });
    } catch (err: any) {
      res.status(500).json({ error: "Verification failed", details: err.message });
    }
  });`);

fs.writeFileSync('server.ts', code);
console.log("VC trust boundary patched");
