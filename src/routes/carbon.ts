import { Router } from 'express';
import { db } from '../db/index.ts';
import { 
  carbon_projects, methodologies, pdd, acva_cases, carbon_claims, certificates,
  project_intakes, ccts_submissions, acva_registry, acva_appointments, monitoring_reports,
  instrument_readiness, audit_packages
} from '../db/schema.ts';

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

// --- PHASE 5: INTAKE & ELIGIBILITY ENDPOINTS ---

carbonRouter.post('/projects/:id/intake', async (req, res) => {
  try {
    const result = await realProjectIntakeEngine.processIntake(req.params.id, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/projects/:id/intake', async (req, res) => {
  try {
    const data = await db.select().from(project_intakes).where(eq(project_intakes.projectId, req.params.id)).orderBy(desc(project_intakes.createdAt)).limit(1);
    if (!data.length) return res.status(404).json({ error: "No intake record found for this project." });
    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/projects/:id/real-eligibility', async (req, res) => {
  try {
    const assessment = await realProjectEligibilityEngine.evaluateRealProject(req.params.id);
    res.json(assessment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PHASE 5: CCTS SUBMISSION GATEWAY ---

carbonRouter.post('/projects/:id/ccts-submit', async (req, res) => {
  try {
    const canProceed = await realProjectIntakeEngine.canProceedToCalculation(req.params.id);
    if (!canProceed) {
      return res.status(400).json({ error: "BLOCKED — Real project intake is incomplete. Cannot submit to CCTS gateway." });
    }

    const { submissionType, documents, monitoringPeriodId, acvaId } = req.body;
    const result = await cctsSubmissionGateway.submitProject(
      req.params.id,
      submissionType || 'PROJECT_REGISTRATION',
      documents || [],
      monitoringPeriodId,
      acvaId
    );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PHASE 5: CERTIFICATE STATE MACHINE ---

carbonRouter.post('/certificates/:id/transition', async (req, res) => {
  try {
    const { newState, officialCertificateIdentifier } = req.body;
    const result = await certificateModel.transitionState(req.params.id, newState, officialCertificateIdentifier);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- PHASE 5: ACVA REGISTRY & APPOINTMENT ---

carbonRouter.get('/acva-registry', async (req, res) => {
  try {
    const data = await acvaSelectionEngine.findAccreditedACVAs();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/projects/:id/appoint-acva', async (req, res) => {
  try {
    const { acvaRegistryId, selectionReason, conflictDeclared } = req.body;
    const result = await acvaSelectionEngine.appointACVA(req.params.id, acvaRegistryId, selectionReason, conflictDeclared || false);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

carbonRouter.post('/acva-cases/:id/action', async (req, res) => {
  try {
    const { action, payload } = req.body;
    const result = await acvaBackend.executeACVAAction(req.params.id, action, payload || {});
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- PHASE 5: MONITORING REPORT & AUDIT PACKAGE ---

carbonRouter.post('/projects/:id/monitoring-report', async (req, res) => {
  try {
    const { monitoringPeriodId, methodologyId, datasetId, calculationRunId, claimedTco2e, qaQcSummary } = req.body;
    const report = await monitoringReportEngine.generateAndFreezeReport(
      req.params.id, monitoringPeriodId, methodologyId, datasetId, calculationRunId, claimedTco2e, qaQcSummary || 'QA/QC Verified'
    );
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/projects/:id/audit-package', async (req, res) => {
  try {
    const pkg = await auditPackageGenerator.generatePackage(req.params.id, req.body.monitoringPeriodId, req.body.requestedBy);
    res.json(pkg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PHASE 5: PUBLIC PROJECT DISCLOSURE ---

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

carbonRouter.post('/pilot/issues', async (req, res) => {
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

carbonRouter.post('/pilot/issues/:issueId/resolve', async (req, res) => {
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

