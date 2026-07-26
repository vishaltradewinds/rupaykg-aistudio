const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const importStatement = `import { SWMComplianceService } from "./src/services/swmComplianceEngine";\n`;
if (!code.includes('swmComplianceEngine')) {
    code = importStatement + code;
}

const apiRoutes = `
  // --- National SWM Compliance Engine Routes ---
  const swmService = new SWMComplianceService();

  app.post("/api/swm/register", async (req: any, res) => {
    try {
      const registration = await swmService.registerEntity(req.body);
      res.json(registration);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/swm/validate", async (req: any, res) => {
    try {
      const { entityId, ruleId, evidenceData } = req.body;
      const result = await swmService.validateCompliance(entityId, ruleId, evidenceData);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/swm/dashboard", async (req: any, res) => {
    try {
      const type = req.query.type as string || 'national';
      const stats = await swmService.getDashboardMetrics(type, {});
      res.json(stats);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  // ---------------------------------------------
`;

if (!code.includes('/api/swm/register')) {
    const splitStr = `  // Catch-all 404 handler for unmatched API routes`;
    if (code.includes(splitStr)) {
        code = code.replace(splitStr, apiRoutes + '\n' + splitStr);
        fs.writeFileSync('server.ts', code);
        console.log('Successfully patched server.ts');
    } else {
        console.error('Could not find injection point');
    }
} else {
    console.log('Already patched');
}
