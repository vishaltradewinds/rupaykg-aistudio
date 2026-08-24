const fs = require('fs');

const routesPath = 'src/routes/carbon.ts';
let code = fs.readFileSync(routesPath, 'utf8');

const importsToAdd = `
import { 
  legal_entities, 
  carbon_programmes, 
  generic_cpas, 
  component_project_activities, 
  bee_methodologies, 
  carbon_rights, 
  monitoring_periods, 
  monitoring_datasets, 
  acva_engagements, 
  mrv_packages 
} from '../db/schema';
import { eq } from 'drizzle-orm';
`;

if (!code.includes('legal_entities')) {
  code = code.replace(/import { db } from '\.\.\/db';/, `import { db } from '../db';\n${importsToAdd}`);
}

const newRoutes = `

// ==========================================
// RUPAYKG ENTERPRISE 3.0: ICM REGISTRY APIs
// ==========================================

carbonRouter.get('/legal-entities', async (req, res) => {
  try {
    const data = await db.select().from(legal_entities);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/legal-entities', async (req, res) => {
  try {
    const { legalName, entityType, country } = req.body;
    const result = await db.insert(legal_entities).values({
      id: "LE-" + Date.now(),
      legalName,
      entityType,
      country
    }).returning();
    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/icm/accounts', async (req, res) => {
  try {
    const data = await db.select().from(icm_accounts);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/programmes', async (req, res) => {
  try {
    const data = await db.select().from(carbon_programmes);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/programmes', async (req, res) => {
  try {
    const { name, description, icmAccountId, programmeType } = req.body;
    const result = await db.insert(carbon_programmes).values({
      id: "POA-" + Date.now(),
      name,
      description,
      icmAccountId,
      programmeType
    }).returning();
    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/generic-cpas', async (req, res) => {
  try {
    const data = await db.select().from(generic_cpas);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/cpas', async (req, res) => {
  try {
    const data = await db.select().from(component_project_activities);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/methodologies', async (req, res) => {
  try {
    const data = await db.select().from(bee_methodologies);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/methodologies', async (req, res) => {
  try {
    const { officialCode, officialTitle, version, methodologyType } = req.body;
    const result = await db.insert(bee_methodologies).values({
      id: "BEE-METH-" + Date.now(),
      officialCode,
      officialTitle,
      version,
      methodologyType
    }).returning();
    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/monitoring-periods', async (req, res) => {
  try {
    const data = await db.select().from(monitoring_periods);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/carbon-rights', async (req, res) => {
  try {
    const data = await db.select().from(carbon_rights);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/mrv-packages', async (req, res) => {
  try {
    const data = await db.select().from(mrv_packages);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/acva-engagements', async (req, res) => {
  try {
    const data = await db.select().from(acva_engagements);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

`;

if (!code.includes('/legal-entities')) {
  code += newRoutes;
}

fs.writeFileSync(routesPath, code);
console.log('Routes patched successfully.');
