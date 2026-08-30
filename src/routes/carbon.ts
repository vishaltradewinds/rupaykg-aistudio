import { Router } from 'express';
import { db } from '../db/index.ts';
import { 
  carbon_projects, methodologies, pdd, acva_cases, carbon_claims, certificates,
  project_intakes, ccts_submissions, acva_registry, acva_appointments, monitoring_reports,
  instrument_readiness, audit_packages
} from '../db/schema.ts';

import {
  urban_ulbs, urban_zones, urban_wards, urban_generators, urban_collection_operators,
  urban_transport_operators, urban_vehicles, waste_manifests, legal_entities,
  carbon_programmes, generic_cpas, component_project_activities, bee_methodologies,
  carbon_rights, monitoring_periods, monitoring_datasets, acva_engagements, mrv_packages,
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
import { INDIA_ENVIRONMENTAL_METHODOLOGIES, getIssuanceEligibleMethodologies, getMethodology } from '../services/indiaMethodologyCatalog.ts';
import crypto from 'crypto';

export const carbonRouter = Router();

// Authoritative India methodology catalogue: approved CCC/GCP methodologies are
// separated from future/reference pathways. RupayKg never treats a reference
// pathway as issuance-eligible until the competent authority notifies it.
carbonRouter.get('/methodologies/india', async (_req, res) => {
  res.json({
    authorityModel: {
      cccIssuer: 'BEE_ICM',
      greenCreditAdministrator: 'GCP_ICFRE',
      rupayKgRole: 'DEPOSITORY_AND_MARKETPLACE_AFTER_AUTHORITATIVE_ISSUANCE',
      acvaRole: 'VALIDATION_AND_VERIFICATION_FOR_CCTS_PROJECTS',
    },
    issuanceEligible: getIssuanceEligibleMethodologies(),
    allTrackedPathways: INDIA_ENVIRONMENTAL_METHODOLOGIES,
  });
});

carbonRouter.get('/methodologies/india/:code', async (req, res) => {
  const methodology = getMethodology(req.params.code);
  if (!methodology) return res.status(404).json({ error: `Methodology ${req.params.code} not found` });
  res.json({ methodology });
});

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
    const userRole = (req as any).user?.role;
    const uid = (req as any).user?.uid;
    let data;
    if (["super_admin", "regulator", "auditor"].includes(userRole)) data = await db.select().from(carbon_projects);
    else data = await db.select().from(carbon_projects).where(eq(carbon_projects.ownerId, uid));
    res.json(data);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.post('/projects', async (req, res) => {
  try {
    const { name, description, wasteSourceRecordId, methodologyId } = req.body;
    const ownerId = (req as any).user?.uid || (req as any).user?.id;
    if (!ownerId) return res.status(401).json({ error: "Missing authenticated user" });
    const newProject = { id: crypto.randomUUID(), name, description, ownerId, wasteSourceRecordId, methodologyId, status: 'DRAFT' };
    await db.insert(carbon_projects).values(newProject);
    res.json(newProject);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.get('/projects/:id', async (req, res) => {
  try {
    const data = await db.select().from(carbon_projects).where(eq(carbon_projects.id, req.params.id));
    if (data.length && data[0].ownerId && data[0].ownerId !== (req as any).user?.uid && !["super_admin", "regulator", "auditor"].includes((req as any).user?.role)) return res.status(403).json({ error: "Cross-tenant access denied" });
    if (!data.length) return res.status(404).json({ error: "Not found" });
    res.json(data[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.post('/projects/:id/intake', async (req, res) => {
  try {
    const project = await db.select().from(carbon_projects).where(eq(carbon_projects.id, req.params.id));
    if (!project.length) return res.status(404).json({ error: "Not found" });
    if (project[0].ownerId && project[0].ownerId !== (req as any).user?.uid && !["super_admin"].includes((req as any).user?.role)) return res.status(403).json({ error: "Cross-tenant mutation denied" });
    res.json(await realProjectIntakeEngine.processIntake(req.params.id, req.body));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.get('/projects/:id/intake', async (req, res) => {
  try {
    const data = await db.select().from(project_intakes).where(eq(project_intakes.projectId, req.params.id)).orderBy(desc(project_intakes.createdAt)).limit(1);
    if (!data.length) return res.status(404).json({ error: "No intake record found for this project." });
    res.json(data[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.post('/projects/:id/real-eligibility', async (req, res) => {
  try { res.json(await realProjectEligibilityEngine.evaluateRealProject(req.params.id)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.post('/projects/:id/ccts-submit', async (req, res) => {
  try {
    const canProceed = await realProjectIntakeEngine.canProceedToCalculation(req.params.id);
    if (!canProceed) return res.status(400).json({ error: "BLOCKED — Real project intake is incomplete. Cannot submit to CCTS gateway." });
    const { submissionType, documents, monitoringPeriodId, acvaId } = req.body;
    res.json(await cctsSubmissionGateway.submitProject(req.params.id, submissionType || 'PROJECT_REGISTRATION', documents || [], monitoringPeriodId, acvaId));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.post('/certificates/:id/transition', async (req, res) => {
  try { res.json(await certificateModel.transitionState(req.params.id, req.body.newState, req.body.officialCertificateIdentifier)); }
  catch (err: any) { res.status(400).json({ error: err.message }); }
});

carbonRouter.get('/acva-registry', async (_req, res) => {
  try { res.json(await acvaSelectionEngine.findAccreditedACVAs()); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.post('/projects/:id/appoint-acva', async (req, res) => {
  try { res.json(await acvaSelectionEngine.appointACVA(req.params.id, req.body.acvaRegistryId, req.body.selectionReason, req.body.conflictDeclared || false)); }
  catch (err: any) { res.status(400).json({ error: err.message }); }
});

carbonRouter.post('/acva-cases/:id/action', async (req, res) => {
  try { res.json(await acvaBackend.executeACVAAction(req.params.id, req.body.action, req.body.payload || {})); }
  catch (err: any) { res.status(400).json({ error: err.message }); }
});

carbonRouter.post('/projects/:id/monitoring-report', async (req, res) => {
  try {
    const { monitoringPeriodId, methodologyId, datasetId, calculationRunId, claimedTco2e, qaQcSummary } = req.body;
    res.json(await monitoringReportEngine.generateAndFreezeReport(req.params.id, monitoringPeriodId, methodologyId, datasetId, calculationRunId, claimedTco2e, qaQcSummary || 'QA/QC Verified'));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.post('/projects/:id/audit-package', async (req, res) => {
  try { res.json(await auditPackageGenerator.generatePackage(req.params.id, req.body.monitoringPeriodId, req.body.requestedBy)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.get('/public/projects/:id', async (req, res) => {
  try {
    const data = await db.select().from(carbon_projects).where(eq(carbon_projects.id, req.params.id));
    if (data.length && data[0].ownerId && data[0].ownerId !== (req as any).user?.uid && !["super_admin", "regulator", "auditor"].includes((req as any).user?.role)) return res.status(403).json({ error: "Cross-tenant access denied" });
    if (!data.length) return res.status(404).json({ error: "Public project record not found." });
    const proj = data[0];
    res.json({ id: proj.id, name: proj.name, description: proj.description, sector: "WASTE_HANDLING_AND_DISPOSAL", methodology: proj.methodologyId || "BM WA03.001", status: proj.status, disclaimer: "PUBLIC PROJECT SUMMARY — PRIVACY & CONFIDENTIALITY PROTECTED" });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.get('/reconciliation/wa03-001', async (req, res) => {
  try {
    const inputs = { F_CH4_PJ_y: parseFloat(req.query.F_CH4_PJ_y as string) || 1000, F_CH4_BL_y: parseFloat(req.query.F_CH4_BL_y as string) || 150, PE_y: parseFloat(req.query.PE_y as string) || 14, LE_y: parseFloat(req.query.LE_y as string) || 0 };
    res.json(WA03_001.getDetailedTrace(inputs));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.get('/pilot/issues/:projectId', async (req, res) => {
  try { res.json(await pilotIssueTracker.getIssuesForProject(req.params.projectId)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.post('/pilot/issues', async (req, res) => {
  try { res.json(await pilotIssueTracker.logIssue(req.body.projectId || 'RKG-JBP-WA03-001-001', req.body)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.post('/pilot/issues/:issueId/resolve', async (req, res) => {
  try { res.json(await pilotIssueTracker.resolveIssue(req.params.issueId, req.body)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.get('/public/projects/jabalpur-landfill', async (_req, res) => {
  res.json({ id: "RKG-JBP-WA03-001-001", name: "Jabalpur Landfill Methane Recovery Pilot", location: "Jabalpur, Madhya Pradesh, India", facility: "Kathonda MSW Processing & Disposal Site (KATHONDA-COMPLEX-JBP)", sector: "Waste Handling and Disposal", methodology: "BM WA03.001 — Candidate", status: "REAL PROJECT — PRE-VALIDATION / DATA COLLECTION", calculatedCarbon: "NOT YET CALCULATED", issuedCCC: 0, acvaStatus: "NOT_YET_APPOINTED", projectOwnerStatus: "PENDING_VERIFICATION", disclaimer: "REAL PROJECT RECORD — PRE-VALIDATION / AWAITING PHYSICAL MRV DATA" });
});

carbonRouter.get('/kathonda/complex', async (_req, res) => res.json({ facility: KATHONDA_COMPLEX_FACILITY, units: KATHONDA_SUB_UNITS, physicalBoundary: KATHONDA_PROJECT_BOUNDARY, accountingBoundary: KATHONDA_CARBON_ACCOUNTING_BOUNDARY, latestLegacyEvent: KATHONDA_LEGACY_REMEDIATION_EVENT }));
carbonRouter.get('/kathonda/pathways', async (_req, res) => res.json(KATHONDA_PATHWAY_SEPARATION));
carbonRouter.get('/kathonda/regulatory-timeline', async (_req, res) => res.json(KATHONDA_REGULATORY_TIMELINE));
carbonRouter.post('/kathonda/mass-balance', async (req, res) => {
  try { res.json(kathondaMassBalanceEngine.calculateMassBalance(Object.fromEntries(Object.entries(req.body).map(([k,v]) => [k, parseFloat(String(v || 0))])) as any)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.post('/kathonda/legacy-mass-balance', async (req, res) => {
  try { res.json(kathondaMassBalanceEngine.calculateLegacyMassBalance(Object.fromEntries(Object.entries(req.body).map(([k,v]) => [k, parseFloat(String(v || 0))])) as any)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.post('/kathonda/double-counting-audit', async (req, res) => {
  try { res.json(kathondaDoubleCountingChecker.runDoubleCountingAudit(req.body)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.get('/kathonda/traceability', async (req, res) => {
  try { res.json(gasMeterTraceabilityEngine.verifyTraceability(String(req.query.meterId || ''), String(req.query.cellId || ''), String(req.query.lfgSystemId || ''))); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.post('/kathonda/calculation-gate', async (req, res) => {
  try { res.json(kathondaCalculationGate.evaluateGate(req.body)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.get('/rural/hub', async (_req, res) => res.json({ facility: SIHORA_RURAL_RESOURCE_HUB, units: SIHORA_RURAL_SUB_UNITS, physicalBoundary: SIHORA_RURAL_PROJECT_BOUNDARY, accountingBoundary: SIHORA_RURAL_CARBON_ACCOUNTING_BOUNDARY }));
carbonRouter.get('/rural/pathways', async (_req, res) => res.json(SIHORA_RURAL_PATHWAY_SEPARATION));
carbonRouter.post('/rural/mass-balance', async (req, res) => {
  try { res.json(ruralBiomassMassBalanceEngine.calculateMassBalance(Object.fromEntries(Object.entries(req.body).map(([k,v]) => [k, parseFloat(String(v || 0))])) as any)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.post('/rural/double-counting-audit', async (req, res) => {
  try { res.json(ruralDoubleCountingChecker.runDoubleCountingAudit(req.body)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.post('/rural/calculation-gate', async (req, res) => {
  try { res.json(ruralCalculationGate.evaluateGate(req.body)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.get('/legal-entities', async (_req, res) => {
  try { res.json(await db.select().from(legal_entities)); } catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.post('/legal-entities', async (req, res) => {
  try { res.json((await db.insert(legal_entities).values({ id: "LE-" + Date.now(), legalName: req.body.legalName, entityType: req.body.entityType, country: req.body.country }).returning())[0]); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.get('/icm/accounts', async (_req, res) => { try { res.json(await db.select().from(icm_accounts)); } catch (err: any) { res.status(500).json({ error: err.message }); } });
carbonRouter.get('/programmes', async (_req, res) => { try { res.json(await db.select().from(carbon_programmes)); } catch (err: any) { res.status(500).json({ error: err.message }); } });
carbonRouter.post('/programmes', async (req, res) => {
  try { res.json((await db.insert(carbon_programmes).values({ id: "POA-" + Date.now(), name: req.body.name, description: req.body.description, icmAccountId: req.body.icmAccountId, programmeType: req.body.programmeType }).returning())[0]); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.get('/generic-cpas', async (_req, res) => { try { res.json(await db.select().from(generic_cpas)); } catch (err: any) { res.status(500).json({ error: err.message }); } });
carbonRouter.get('/cpas', async (_req, res) => { try { res.json(await db.select().from(component_project_activities)); } catch (err: any) { res.status(500).json({ error: err.message }); } });

// Existing database methodology records remain available for legacy/CQE views.
carbonRouter.get('/methodologies/db', async (_req, res) => {
  try { res.json(await db.select().from(bee_methodologies)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.post('/methodologies/db', async (req, res) => {
  try {
    const result = await db.insert(bee_methodologies).values({ id: "BEE-METH-" + Date.now(), officialCode: req.body.officialCode, officialTitle: req.body.officialTitle, version: req.body.version, methodologyType: req.body.methodologyType }).returning();
    res.json(result[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

carbonRouter.get('/monitoring-periods', async (_req, res) => { try { res.json(await db.select().from(monitoring_periods)); } catch (err: any) { res.status(500).json({ error: err.message }); } });
carbonRouter.get('/carbon-rights', async (_req, res) => { try { res.json(await db.select().from(carbon_rights)); } catch (err: any) { res.status(500).json({ error: err.message }); } });
carbonRouter.get('/mrv-packages', async (_req, res) => { try { res.json(await db.select().from(mrv_packages)); } catch (err: any) { res.status(500).json({ error: err.message }); } });
carbonRouter.get('/acva-engagements', async (_req, res) => { try { res.json(await db.select().from(acva_engagements)); } catch (err: any) { res.status(500).json({ error: err.message }); } });

carbonRouter.get('/urban/ulbs', async (_req, res) => { try { res.json(await db.select().from(urban_ulbs)); } catch (err: any) { res.status(500).json({ error: err.message }); } });
carbonRouter.post('/urban/ulbs', async (req, res) => {
  try { res.json((await db.insert(urban_ulbs).values({ id: "ULB-" + Date.now(), legalEntityId: req.body.legalEntityId, name: req.body.name, type: req.body.type, district: req.body.district, state: req.body.state }).returning())[0]); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.get('/urban/zones', async (_req, res) => { try { res.json(await db.select().from(urban_zones)); } catch (err: any) { res.status(500).json({ error: err.message }); } });
carbonRouter.get('/urban/wards', async (_req, res) => { try { res.json(await db.select().from(urban_wards)); } catch (err: any) { res.status(500).json({ error: err.message }); } });
carbonRouter.get('/urban/manifests', async (_req, res) => { try { res.json(await db.select().from(waste_manifests)); } catch (err: any) { res.status(500).json({ error: err.message }); } });
carbonRouter.post('/urban/manifests', async (req, res) => {
  try {
    const result = await db.insert(waste_manifests).values({ id: "WM-" + Date.now(), generatorId: req.body.generatorId, collectionOperatorId: req.body.collectionOperatorId, transportOperatorId: req.body.transportOperatorId, vehicleId: req.body.vehicleId, destinationFacilityId: req.body.destinationFacilityId, materialType: req.body.materialType, weightKg: req.body.weightKg, collectedAt: new Date(), status: 'IN_TRANSIT' }).returning();
    res.json(result[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
carbonRouter.post('/urban/manifests/:id/deliver', async (req, res) => {
  try {
    const result = await db.update(waste_manifests).set({ status: 'DELIVERED', deliveredAt: new Date(), weighbridgeRecordId: req.body.weighbridgeRecordId }).where(eq(waste_manifests.id, req.params.id)).returning();
    res.json(result[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
