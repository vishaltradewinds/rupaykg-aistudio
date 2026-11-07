import { Router } from 'express';
import { db } from '../db/index.ts';
import { 
  carbon_projects, methodologies, pdd, acva_cases, carbon_claims, certificates,
  project_intakes, ccts_submissions, acva_registry, acva_appointments, monitoring_reports,
  instrument_readiness, audit_packages
} from '../db/schema.ts';

import {

  urban_ulbs,
  urban_zones,
  urban_wards,
  urban_generators,
  urban_collection_operators,
  urban_transport_operators,
  urban_vehicles,
  waste_manifests
,
  legal_entities, 
  carbon_programmes, 
  generic_cpas, 
  component_project_activities, 
  bee_methodologies, 
  carbon_rights, 
  monitoring_periods, 
  monitoring_datasets, 
  acva_engagements, 
  mrv_packages,
  icm_accounts
} from '../db/schema.ts';

import { eq, desc } from 'drizzle-orm';
import { 
  carbonCalculationEngine, realProjectIntakeEngine, realProjectEligibilityEngine,
  cctsSubmissionGateway, certificateModel, acvaSelectionEngine, acvaBackend,
  monitoringReportEngine, instrumentReadinessEngine, auditPackageGenerator,
  pilotIssueTracker
} from '../services/carbonOsService.ts';
import {
  KATHONDA_COMPLEX_FACILITY, KATHONDA_SUB_UNITS, KATHONDA_PROJECT_BOUNDARY,
  KATHONDA_CARBON_ACCOUNTING_BOUNDARY, KATHONDA_LEGACY_REMEDIATION_EVENT,
  KATHONDA_PATHWAY_SEPARATION, KATHONDA_REGULATORY_TIMELINE,
  gasMeterTraceabilityEngine, kathondaMassBalanceEngine, kathondaDoubleCountingChecker,
  bmWA03001ApplicabilityGuard, kathondaCalculationGate
} from '../services/kathondaBoundaryService.ts';
import {
  SIHORA_RURAL_RESOURCE_HUB, SIHORA_RURAL_SUB_UNITS, SIHORA_RURAL_PROJECT_BOUNDARY,
  SIHORA_RURAL_CARBON_ACCOUNTING_BOUNDARY, SIHORA_RURAL_PATHWAY_SEPARATION,
  ruralBiomassMassBalanceEngine, ruralDoubleCountingChecker, ruralCalculationGate
} from '../services/ruralBoundaryService.ts';
import { WA03_001 } from '../../packages/methodology/wa03-001/index.ts';
import crypto from 'crypto';
import { requireTenantContext, type TenantRequest } from '../security/tenantContext.ts';
import { listTenantCarbonProjects, createTenantCarbonProject, getTenantCarbonProject, requireTenantCarbonProject } from '../security/tenantCarbonProject.ts';
import { createProjectActivity, createProjectMeasurement, createProjectEvidence, createProjectCalculation } from '../security/tenantCarbonWorkflowWrites.ts';
import { rejectLegacyWorkflow } from '../security/legacyWorkflowGate.ts';
import { createTenantVerification, listTenantVerifications } from '../security/tenantVerification.ts';
import { listTenantCpcbWorkspaces, createTenantCpcbWorkspace, recordCpcbStatus, listTenantEprApplicability, upsertTenantEprApplicability, listTenantBwgAssessments, createTenantBwgAssessment } from '../security/tenantCpcbCompliance.ts';
import { createTenantClaim, listTenantClaims, createTenantCredential, listTenantCredentials } from '../security/tenantClaimCredential.ts';
import { createTenantRegistryEvent, listTenantRegistryEvents } from '../security/tenantRegistryEvent.ts';

export const carbonRouter = Router();

// Authoritative tenant gate for project-scoped routes. Production RLS remains disabled; this is application-layer enforcement pending rehearsal.
carbonRouter.use('/projects/:id', requireTenantCarbonProject);

carbonRouter.get('/methodologies', async (req, res) => {
  try {
    const data = await db.select().from(methodologies);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/projects', requireTenantContext, async (req, res) => {
  try {
    const data = await listTenantCarbonProjects(req as TenantRequest);
    res.json(data);
  } catch (err: any) {
    res.status(503).json({ error: 'Tenant project service unavailable', code: 'TENANT_PROJECT_SERVICE_UNAVAILABLE' });
  }
});

carbonRouter.post('/projects', requireTenantContext, async (req, res) => {
  try {
    const project = await createTenantCarbonProject(req as TenantRequest, req.body || {});
    res.status(201).json(project);
  } catch (err: any) {
    const message = String(err?.message || err);
    if (message.includes('required')) return res.status(400).json({ error: message });
    res.status(503).json({ error: 'Tenant project service unavailable', code: 'TENANT_PROJECT_SERVICE_UNAVAILABLE' });
  }
});

carbonRouter.get('/projects/:id', async (req, res) => {
  try {
    const project = (req as any).tenantProject || await getTenantCarbonProject(req as TenantRequest, req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err: any) {
    res.status(503).json({ error: 'Tenant project service unavailable', code: 'TENANT_PROJECT_SERVICE_UNAVAILABLE' });
  }
});

// --- AUTHORITATIVE LIVE MRV WORKFLOW ENDPOINTS ---
// These endpoints use the live production workflow model: activities -> measurements/evidence -> carbon_calculations.
// They are tenant-scoped and transaction-bound. Legacy Phase-5 endpoints remain pending replacement/reconciliation.

carbonRouter.post('/projects/:id/activities', requireTenantContext, async (req, res) => {
  try {
    const activity = await createProjectActivity(req as TenantRequest, req.params.id, req.body || {});
    if (!activity) return res.status(404).json({ error: 'Project not found or not authorized' });
    res.status(201).json(activity);
  } catch {
    res.status(503).json({ error: 'Live activity service unavailable', code: 'LIVE_ACTIVITY_SERVICE_UNAVAILABLE' });
  }
});

carbonRouter.post('/projects/:id/activities/:activityId/measurements', requireTenantContext, async (req, res) => {
  try {
    const measurement = await createProjectMeasurement(req as TenantRequest, req.params.id, req.params.activityId, req.body || {});
    if (!measurement) return res.status(404).json({ error: 'Activity not found or not authorized' });
    res.status(201).json(measurement);
  } catch (err: any) {
    res.status(400).json({ error: String(err?.message || err) });
  }
});

carbonRouter.post('/projects/:id/activities/:activityId/evidence', requireTenantContext, async (req, res) => {
  try {
    const evidence = await createProjectEvidence(req as TenantRequest, req.params.id, req.params.activityId, req.body || {});
    if (!evidence) return res.status(404).json({ error: 'Activity not found or not authorized' });
    res.status(201).json(evidence);
  } catch (err: any) {
    res.status(400).json({ error: String(err?.message || err) });
  }
});

carbonRouter.post('/projects/:id/activities/:activityId/calculations', requireTenantContext, async (req, res) => {
  try {
    const calculation = await createProjectCalculation(req as TenantRequest, req.params.id, req.params.activityId, req.body || {});
    if (!calculation) return res.status(404).json({ error: 'Activity not found or not authorized' });
    res.status(201).json(calculation);
  } catch (err: any) {
    res.status(400).json({ error: String(err?.message || err) });
  }
});

// --- AUTHORITATIVE LIVE VERIFICATION ENDPOINTS ---
carbonRouter.post('/projects/:id/activities/:activityId/verifications', requireTenantContext, async (req, res) => {
  try {
    const result = await createTenantVerification(req as TenantRequest, {
      activityId: req.params.activityId,
      evidenceId: req.body?.evidenceId,
      decision: req.body?.decision,
      scope: req.body?.scope,
      rationale: req.body?.rationale
    });
    if (!result) return res.status(404).json({ error: 'Activity not found or not authorized' });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: String(err?.message || err) });
  }
});

carbonRouter.get('/projects/:id/activities/:activityId/verifications', requireTenantContext, async (req, res) => {
  try {
    const result = await listTenantVerifications(req as TenantRequest, req.params.activityId);
    if (!result) return res.status(404).json({ error: 'Activity not found or not authorized' });
    res.json(result);
  } catch {
    res.status(503).json({ error: 'Live verification service unavailable', code: 'LIVE_VERIFICATION_SERVICE_UNAVAILABLE' });
  }
});

// --- AUTHORITATIVE LIVE CLAIM / CREDENTIAL / REGISTRY ENDPOINTS ---
carbonRouter.post('/projects/:id/activities/:activityId/claims', requireTenantContext, async (req, res) => {
  try {
    const result = await createTenantClaim(req as TenantRequest, { ...req.body, activityId: req.params.activityId });
    if (!result) return res.status(404).json({ error: 'Activity not found or not authorized' });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: String(err?.message || err) });
  }
});
carbonRouter.get('/projects/:id/activities/:activityId/claims', requireTenantContext, async (req, res) => {
  try {
    const result = await listTenantClaims(req as TenantRequest, req.params.activityId);
    if (!result) return res.status(404).json({ error: 'Activity not found or not authorized' });
    res.json(result);
  } catch {
    res.status(503).json({ error: 'Live claim service unavailable', code: 'LIVE_CLAIM_SERVICE_UNAVAILABLE' });
  }
});
carbonRouter.post('/projects/:id/activities/:activityId/credentials', requireTenantContext, async (req, res) => {
  try {
    const result = await createTenantCredential(req as TenantRequest, { ...req.body, activityId: req.params.activityId });
    if (!result) return res.status(404).json({ error: 'Activity not found or not authorized' });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: String(err?.message || err) });
  }
});
carbonRouter.get('/projects/:id/activities/:activityId/credentials', requireTenantContext, async (req, res) => {
  try {
    const result = await listTenantCredentials(req as TenantRequest, req.params.activityId);
    if (!result) return res.status(404).json({ error: 'Activity not found or not authorized' });
    res.json(result);
  } catch {
    res.status(503).json({ error: 'Live credential service unavailable', code: 'LIVE_CREDENTIAL_SERVICE_UNAVAILABLE' });
  }
});
carbonRouter.post('/credentials/:credentialId/registry-events', requireTenantContext, async (req, res) => {
  try {
    const result = await createTenantRegistryEvent(req as TenantRequest, { ...req.body, credentialId: req.params.credentialId });
    if (!result) return res.status(404).json({ error: 'Credential not found or not authorized' });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: String(err?.message || err) });
  }
});
carbonRouter.get('/credentials/:credentialId/registry-events', requireTenantContext, async (req, res) => {
  try {
    const result = await listTenantRegistryEvents(req as TenantRequest, req.params.credentialId);
    if (!result) return res.status(404).json({ error: 'Credential not found or not authorized' });
    res.json(result);
  } catch {
    res.status(503).json({ error: 'Live registry service unavailable', code: 'LIVE_REGISTRY_SERVICE_UNAVAILABLE' });
  }
});

// --- AUTHORITATIVE LIVE CPCB/SWM COMPLIANCE ENDPOINTS ---
carbonRouter.get('/compliance/cpcb/workspaces', requireTenantContext, async (req,res)=>{
 try{const r=await listTenantCpcbWorkspaces(req as TenantRequest);res.json(r);}catch{res.status(503).json({error:'CPCB workspace service unavailable'});}
});
carbonRouter.post('/compliance/cpcb/workspaces', requireTenantContext, async (req,res)=>{
 try{const r=await createTenantCpcbWorkspace(req as TenantRequest,req.body||{});if(!r)return res.status(403).json({error:'Tenant context required'});res.status(201).json(r);}catch(err:any){res.status(400).json({error:String(err?.message||err)});}
});
carbonRouter.post('/compliance/cpcb/workspaces/:workspaceId/status', requireTenantContext, async (req,res)=>{
 try{const r=await recordCpcbStatus(req as TenantRequest,req.params.workspaceId,req.body||{});if(!r)return res.status(404).json({error:'Workspace not found or not authorized'});res.status(201).json(r);}catch(err:any){res.status(400).json({error:String(err?.message||err)});}
});
carbonRouter.get('/compliance/epr/applicability', requireTenantContext, async (req,res)=>{
 try{res.json(await listTenantEprApplicability(req as TenantRequest));}catch{res.status(503).json({error:'EPR applicability service unavailable'});}
});
carbonRouter.post('/compliance/epr/applicability', requireTenantContext, async (req,res)=>{
 try{const r=await upsertTenantEprApplicability(req as TenantRequest,req.body||{});if(!r)return res.status(403).json({error:'Tenant context required'});res.status(201).json(r);}catch(err:any){res.status(400).json({error:String(err?.message||err)});}
});
carbonRouter.get('/compliance/bwg/assessments', requireTenantContext, async (req,res)=>{
 try{res.json(await listTenantBwgAssessments(req as TenantRequest));}catch{res.status(503).json({error:'BWG assessment service unavailable'});}
});
carbonRouter.post('/compliance/bwg/assessments', requireTenantContext, async (req,res)=>{
 try{const r=await createTenantBwgAssessment(req as TenantRequest,req.body||{});if(!r)return res.status(403).json({error:'Tenant context required'});res.status(201).json(r);}catch(err:any){res.status(400).json({error:String(err?.message||err)});}
});

// --- LEGACY PHASE-5 WORKFLOW BOUNDARY ---
// These repository-era workflow routes are retained as explicit fail-closed boundaries.
// The authoritative live model is implemented through the MRV endpoints above.
// No stale-schema/global-authorization write path is allowed to execute.

const legacyWorkflowWrite = (req: TenantRequest, res: any) => rejectLegacyWorkflow(req, res);

for (const path of [
  '/projects/:id/intake',
  '/projects/:id/real-eligibility',
  '/projects/:id/ccts-submit',
  '/certificates/:id/transition',
  '/projects/:id/appoint-acva',
  '/acva-cases/:id/action',
  '/projects/:id/monitoring-report',
  '/projects/:id/audit-package',
  '/pilot/issues',
  '/pilot/issues/:issueId/resolve'
]) {
  carbonRouter.post(path, requireTenantContext, legacyWorkflowWrite);
}

carbonRouter.get('/projects/:id/intake', requireTenantContext, legacyWorkflowWrite);
carbonRouter.get('/acva-registry', async (req, res) => {
  try {
    const data = await acvaSelectionEngine.findAccreditedACVAs();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Public disclosure is informational only; it must not perform tenant-sensitive mutation.
carbonRouter.get('/public/projects/:id', async (req, res) => {
  try {
    const data = await db.select().from(carbon_projects).where(eq(carbon_projects.id, req.params.id));
    if (!data.length) return res.status(404).json({ error: "Public project record not found." });
    const proj = data[0];
    res.json({
      id: proj.id,
      name: proj.name,
      description: proj.description,
      sector: "WASTE_HANDLING_AND_DISPOSAL",
      methodology: proj.methodologyId || "BM WA03.001",
      status: proj.status,
      disclaimer: "PUBLIC PROJECT SUMMARY — PRIVACY & CONFIDENTIALITY PROTECTED"
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PHASE 6: MATHEMATICAL RECONCILIATION EXPOSURE ---

carbonRouter.get('/reconciliation/wa03-001', async (req, res) => {
  try {
    const inputs = {
      F_CH4_PJ_y: parseFloat(req.query.F_CH4_PJ_y as string) || 1000,
      F_CH4_BL_y: parseFloat(req.query.F_CH4_BL_y as string) || 150,
      PE_y: parseFloat(req.query.PE_y as string) || 14,
      LE_y: parseFloat(req.query.LE_y as string) || 0
    };
    const trace = WA03_001.getDetailedTrace(inputs);
    res.json(trace);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PHASE 6: SYSTEM LEARNING ENGINE & PILOT ISSUE TRACKER ---

carbonRouter.get('/pilot/issues/:projectId', async (req, res) => {
  try {
    const issues = await pilotIssueTracker.getIssuesForProject(req.params.projectId);
    res.json(issues);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/pilot/issues', requireTenantContext, (req, res) => { return rejectLegacyWorkflow(req as TenantRequest, res); /*
  try {
    const { projectId, issueType, title, description, impact, rootCause } = req.body;
    const result = await pilotIssueTracker.logIssue(projectId || 'RKG-JBP-WA03-001-001', {
      issueType, title, description, impact, rootCause
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/pilot/issues/:issueId/resolve', requireTenantContext, (req, res) => { return rejectLegacyWorkflow(req as TenantRequest, res); /*
  try {
    const { evidenceAccepted, resolutionTimeHours, acvaSatisfied, futureIntakeGuidanceUpdate } = req.body;
    const result = await pilotIssueTracker.resolveIssue(req.params.issueId, {
      evidenceAccepted, resolutionTimeHours, acvaSatisfied, futureIntakeGuidanceUpdate
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- JABALPUR PILOT PUBLIC DISCLOSURE & DOCUMENTATION ENDPOINTS ---

carbonRouter.get('/public/projects/jabalpur-landfill', async (req, res) => {
  res.json({
    id: "RKG-JBP-WA03-001-001",
    name: "Jabalpur Landfill Methane Recovery Pilot",
    location: "Jabalpur, Madhya Pradesh, India",
    facility: "Kathonda MSW Processing & Disposal Site (KATHONDA-COMPLEX-JBP)",
    sector: "Waste Handling and Disposal",
    methodology: "BM WA03.001 — Candidate",
    status: "REAL PROJECT — PRE-VALIDATION / DATA COLLECTION",
    calculatedCarbon: "NOT YET CALCULATED",
    issuedCCC: 0,
    acvaStatus: "NOT_YET_APPOINTED",
    projectOwnerStatus: "PENDING_VERIFICATION",
    disclaimer: "REAL PROJECT RECORD — PRE-VALIDATION / AWAITING PHYSICAL MRV DATA"
  });
});

// --- PHASE 6.5: KATHONDA PHYSICAL BOUNDARY & MASS BALANCE ENDPOINTS ---

carbonRouter.get('/kathonda/complex', async (req, res) => {
  res.json({
    facility: KATHONDA_COMPLEX_FACILITY,
    units: KATHONDA_SUB_UNITS,
    physicalBoundary: KATHONDA_PROJECT_BOUNDARY,
    accountingBoundary: KATHONDA_CARBON_ACCOUNTING_BOUNDARY,
    latestLegacyEvent: KATHONDA_LEGACY_REMEDIATION_EVENT
  });
});

carbonRouter.get('/kathonda/pathways', async (req, res) => {
  res.json(KATHONDA_PATHWAY_SEPARATION);
});

carbonRouter.get('/kathonda/regulatory-timeline', async (req, res) => {
  res.json(KATHONDA_REGULATORY_TIMELINE);
});

carbonRouter.post('/kathonda/mass-balance', async (req, res) => {
  try {
    const { freshMswInTonnes, wteFeedTonnes, rdfProdTonnes, compostProdTonnes, landfillDisposalTonnes, recycledProdTonnes } = req.body;
    const result = kathondaMassBalanceEngine.calculateMassBalance({
      freshMswInTonnes: parseFloat(freshMswInTonnes || 0),
      wteFeedTonnes: parseFloat(wteFeedTonnes || 0),
      rdfProdTonnes: parseFloat(rdfProdTonnes || 0),
      compostProdTonnes: parseFloat(compostProdTonnes || 0),
      landfillDisposalTonnes: parseFloat(landfillDisposalTonnes || 0),
      recycledProdTonnes: parseFloat(recycledProdTonnes || 0)
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/kathonda/legacy-mass-balance', async (req, res) => {
  try {
    const { initialLegacyTonnes, remediatedTonnes, rdfRecoveredTonnes, recycledFractionTonnes, landfillRejectTonnes, remainingLegacyTonnes } = req.body;
    const result = kathondaMassBalanceEngine.calculateLegacyMassBalance({
      initialLegacyTonnes: parseFloat(initialLegacyTonnes || 0),
      remediatedTonnes: parseFloat(remediatedTonnes || 0),
      rdfRecoveredTonnes: parseFloat(rdfRecoveredTonnes || 0),
      recycledFractionTonnes: parseFloat(recycledFractionTonnes || 0),
      landfillRejectTonnes: parseFloat(landfillRejectTonnes || 0),
      remainingLegacyTonnes: parseFloat(remainingLegacyTonnes || 0)
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/kathonda/double-counting-audit', async (req, res) => {
  try {
    const audit = kathondaDoubleCountingChecker.runDoubleCountingAudit(req.body);
    res.json(audit);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/kathonda/traceability', async (req, res) => {
  try {
    const { meterId, cellId, lfgSystemId } = req.query;
    const result = gasMeterTraceabilityEngine.verifyTraceability(
      (meterId as string) || '',
      (cellId as string) || '',
      (lfgSystemId as string) || ''
    );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/kathonda/calculation-gate', async (req, res) => {
  try {
    const gateStatus = kathondaCalculationGate.evaluateGate(req.body);
    res.json(gateStatus);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PHASE 6.5: SIHORA RURAL RESOURCE HUB & BOUNDARY ENDPOINTS ---

carbonRouter.get('/rural/hub', async (req, res) => {
  res.json({
    facility: SIHORA_RURAL_RESOURCE_HUB,
    units: SIHORA_RURAL_SUB_UNITS,
    physicalBoundary: SIHORA_RURAL_PROJECT_BOUNDARY,
    accountingBoundary: SIHORA_RURAL_CARBON_ACCOUNTING_BOUNDARY
  });
});

carbonRouter.get('/rural/pathways', async (req, res) => {
  res.json(SIHORA_RURAL_PATHWAY_SEPARATION);
});

carbonRouter.post('/rural/mass-balance', async (req, res) => {
  try {
    const {
      rawGobarInTonnes, paddyStrawInTonnes, organicWasteInTonnes,
      bioCngProducedKg, fomLiquidProducedTonnes, briquettesProducedTonnes,
      biocharProducedTonnes, vermicompostProducedTonnes
    } = req.body;

    const result = ruralBiomassMassBalanceEngine.calculateMassBalance({
      rawGobarInTonnes: parseFloat(rawGobarInTonnes || 0),
      paddyStrawInTonnes: parseFloat(paddyStrawInTonnes || 0),
      organicWasteInTonnes: parseFloat(organicWasteInTonnes || 0),
      bioCngProducedKg: parseFloat(bioCngProducedKg || 0),
      fomLiquidProducedTonnes: parseFloat(fomLiquidProducedTonnes || 0),
      briquettesProducedTonnes: parseFloat(briquettesProducedTonnes || 0),
      biocharProducedTonnes: parseFloat(biocharProducedTonnes || 0),
      vermicompostProducedTonnes: parseFloat(vermicompostProducedTonnes || 0)
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/rural/double-counting-audit', async (req, res) => {
  try {
    const audit = ruralDoubleCountingChecker.runDoubleCountingAudit(req.body);
    res.json(audit);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/rural/calculation-gate', async (req, res) => {
  try {
    const gateStatus = ruralCalculationGate.evaluateGate(req.body);
    res.json(gateStatus);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});




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


// ==========================================
// RUPAYKG ENTERPRISE 3.0: URBAN APIs
// ==========================================

carbonRouter.get('/urban/ulbs', async (req, res) => {
  try {
    const data = await db.select().from(urban_ulbs);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/urban/ulbs', async (req, res) => {
  try {
    const { legalEntityId, name, type, district, state } = req.body;
    const result = await db.insert(urban_ulbs).values({
      id: "ULB-" + Date.now(),
      legalEntityId,
      name,
      type,
      district,
      state
    }).returning();
    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/urban/zones', async (req, res) => {
  try {
    const data = await db.select().from(urban_zones);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/urban/wards', async (req, res) => {
  try {
    const data = await db.select().from(urban_wards);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/urban/manifests', async (req, res) => {
  try {
    const data = await db.select().from(waste_manifests);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/urban/manifests', async (req, res) => {
  try {
    const { 
      generatorId, collectionOperatorId, transportOperatorId, 
      vehicleId, destinationFacilityId, materialType, weightKg 
    } = req.body;
    
    const result = await db.insert(waste_manifests).values({
      id: "WM-" + Date.now(),
      generatorId,
      collectionOperatorId,
      transportOperatorId,
      vehicleId,
      destinationFacilityId,
      materialType,
      weightKg,
      collectedAt: new Date(),
      status: 'IN_TRANSIT'
    }).returning();
    
    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/urban/manifests/:id/deliver', async (req, res) => {
  try {
    const { weighbridgeRecordId } = req.body;
    const result = await db.update(waste_manifests)
      .set({ 
        status: 'DELIVERED', 
        deliveredAt: new Date(),
        weighbridgeRecordId
      })
      .where(eq(waste_manifests.id, req.params.id))
      .returning();
      
    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

