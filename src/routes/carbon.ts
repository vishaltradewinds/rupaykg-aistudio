import { Router } from 'express';
import { db } from '../db/index.ts';
import { 
  carbon_projects, methodologies, pdd, acva_cases, carbon_claims, certificates 
} from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import { carbonCalculationEngine } from '../services/carbonOsService.ts';
import crypto from 'crypto';

export const carbonRouter = Router();

carbonRouter.get('/methodologies', async (req, res) => {
  try {
    const data = await db.select().from(methodologies);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/projects', async (req, res) => {
  try {
    const data = await db.select().from(carbon_projects);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/projects', async (req, res) => {
  try {
    const { name, description, ownerId, wasteSourceRecordId, methodologyId } = req.body;
    const newProject = {
      id: crypto.randomUUID(),
      name,
      description,
      ownerId,
      wasteSourceRecordId,
      methodologyId,
      status: 'DRAFT',
    };
    await db.insert(carbon_projects).values(newProject);
    res.json(newProject);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/projects/:id', async (req, res) => {
  try {
    const data = await db.select().from(carbon_projects).where(eq(carbon_projects.id, req.params.id));
    if (!data.length) return res.status(404).json({ error: "Not found" });
    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/projects/:id/eligibility', async (req, res) => {
  try {
    const data = await db.select().from(carbon_projects).where(eq(carbon_projects.id, req.params.id));
    if (!data.length) return res.status(404).json({ error: "Project not found" });
    
    const recordId = data[0].wasteSourceRecordId;
    if (!recordId) return res.status(400).json({ error: "Project lacks a connected waste source transaction for eligibility evaluation." });

    const result = await carbonCalculationEngine.evaluateEligibility(recordId, req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/projects/:id/mrv', async (req, res) => {
  res.json({ message: "MRV dataset created" });
});

carbonRouter.post('/projects/:id/calculations', async (req, res) => {
  try {
    const { datasetId, methodology, version } = req.body;
    const result = await carbonCalculationEngine.run(methodology, version, datasetId, req.body.inputs || {});
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/projects/:id/pdd', async (req, res) => {
  try {
    const newPdd = {
      id: crypto.randomUUID(),
      projectId: req.params.id,
      status: 'DRAFT'
    };
    await db.insert(pdd).values(newPdd);
    res.json(newPdd);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/projects/:id/acva', async (req, res) => {
  try {
    const newAcva = {
      id: crypto.randomUUID(),
      projectId: req.params.id,
      type: req.body.type || 'VALIDATION',
      status: 'OPEN'
    };
    await db.insert(acva_cases).values(newAcva);
    res.json(newAcva);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/projects/:id/verification', async (req, res) => {
  res.json({ message: "Verification requested" });
});

carbonRouter.get('/projects/:id/claims', async (req, res) => {
  try {
    res.json([]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/projects/:id/certificates', async (req, res) => {
  try {
    res.json([]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
