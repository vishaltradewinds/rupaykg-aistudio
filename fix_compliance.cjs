const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.post\("\/api\/generators\/:id\/compliance", auth\(\), async \(req: any, res\) => \{\n([\s\S]*?)res\.status\(201\)\.json\(newRecord\);\n  \}\);/g;

content = content.replace(regex, `app.post("/api/generators/:id/compliance", auth(), async (req: any, res) => {
    if (!req.body.compliance_proof_hash) {
      return res.status(400).json({ error: "compliance_proof_hash is required" });
    }
    const newRecord = {
      id: "comp_" + Date.now(),
      generator_id: req.params.id,
      generatorId: req.params.id,
      waste_batch_id: req.body.waste_batch_id || "REC_GENERIC",
      wasteBatchId: req.body.waste_batch_id || "REC_GENERIC",
      compliance_proof_hash: req.body.compliance_proof_hash,
      complianceProofHash: req.body.compliance_proof_hash,
      classification: req.body.classification || "non-hazardous",
      epr_ref_number: req.body.epr_ref_number || "EPR-REF-" + Date.now(),
      eprRefNumber: req.body.epr_ref_number || "EPR-REF-" + Date.now(),
      regulator_review_status: "approved",
      regulatorReviewStatus: "approved",
      verified_at: new Date().toISOString(),
      verifiedAt: new Date(),
    };
    await ComplianceService.addRecord(newRecord);
    res.status(201).json(newRecord);
  });`);

fs.writeFileSync('server.ts', content);
