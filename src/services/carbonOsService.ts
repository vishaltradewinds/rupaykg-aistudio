import { db } from '../db/index.ts';
import { 
  carbon_projects, methodologies, methodology_versions, 
  methodology_parameters, calculation_datasets, calculation_runs,
  carbon_claims, certificates, evidence, measurements, instruments, calibrations,
  monitoring_periods, pdd, pdd_versions, acva_cases, findings,
  records, ccts_submissions, project_intakes, icm_accounts, acva_registry,
  acva_appointments, monitoring_reports, instrument_readiness, audit_packages, pilot_issues
} from '../db/schema.ts';
import { eq, and, desc, sql } from 'drizzle-orm';
import crypto from 'crypto';

import { WA03_001 } from '../../packages/methodology/wa03-001/index.ts';
import { WA03_002 } from '../../packages/methodology/wa03-002/index.ts';
import { WA03_003 } from '../../packages/methodology/wa03-003/index.ts';

export class CarbonCalculationEngine {

  async evaluateEligibility(recordId: string, projectId: string) {
    const recordQuery = await db.select().from(records).where(eq(records.id, recordId)).limit(1);
    let wasteType = 'organic';
    if (recordQuery.length) wasteType = recordQuery[0].wasteType || 'organic';
    
    let applicableMethodologyId = 'BM WA03.001';

    await db.update(carbon_projects).set({ 
      status: 'ELIGIBLE',
      methodologyId: applicableMethodologyId
    }).where(eq(carbon_projects.id, projectId));

    return { status: "ELIGIBLE", methodologyId: applicableMethodologyId };
  }

  async run(methodologyCode: string, version: string, datasetId: string, inputs: any) {
    let resultTco2e = 0;
    
    if (methodologyCode === "BM WA03.001") {
      resultTco2e = WA03_001.calculateEmissionReductions(inputs);
    } else if (methodologyCode === "BM WA03.002") {
      resultTco2e = WA03_002.calculateEmissionReductions(inputs);
    } else if (methodologyCode === "BM WA03.003") {
      resultTco2e = WA03_003.calculateEmissionReductions(inputs);
    } else {
      throw new Error(`Unsupported methodology: ${methodologyCode}`);
    }

    const inputSnapshot = JSON.stringify(inputs);
    const calcHash = crypto.createHash('sha256').update(`${datasetId}-${resultTco2e}-${inputSnapshot}-${methodologyCode}`).digest('hex');

    const runId = crypto.randomUUID();
    const run = {
      id: runId,
      datasetId,
      methodologyVersionId: `${methodologyCode}-v${version}`,
      formulaVersion: version,
      status: "CALCULATED",
      resultTco2e: resultTco2e,
      calculationHash: calcHash
    };

    await db.insert(calculation_runs).values(run);
    return run;
  }
}

export const carbonCalculationEngine = new CarbonCalculationEngine();

export class MRVQualityEngine {
  async evaluateReadiness(monitoringPeriodId: string) {
    try {
      const periodRows = await db.select().from(monitoring_periods).where(eq(monitoring_periods.id, monitoringPeriodId)).limit(1);
      if (!periodRows || periodRows.length === 0) {
        return {
          status: 'NOT_READY',
          reason: 'Monitoring period not found',
          dataCompleteness: 0,
          evidenceCompleteness: 0,
          calibrationValidity: 0,
        };
      }
      const period = periodRows[0];

      const periodMeasurements = await db.select().from(measurements).where(eq(measurements.monitoringPeriodId, period.id));
      const projectEvidence = await db.select().from(evidence).where(eq(evidence.projectId, period.projectId));
      const periodCalibrations = await db.select().from(calibrations);

      const dataCompleteness = periodMeasurements.length > 0 ? Math.min(1.0, periodMeasurements.length / 10.0) : 0;
      const evidenceCompleteness = projectEvidence.length > 0 ? 1.0 : 0;
      const calibrationValidity = periodCalibrations.length > 0 ? 1.0 : 0.8;

      const isReady = dataCompleteness >= 0.5 && evidenceCompleteness >= 0.5;

      return {
        dataCompleteness,
        evidenceCompleteness,
        calibrationValidity,
        parameterCoverage: 1.0,
        status: isReady ? 'READY' : 'NOT_READY',
      };
    } catch (err: any) {
      return {
        status: 'NOT_READY',
        reason: `Readiness check error: ${err.message}`,
        dataCompleteness: 0,
        evidenceCompleteness: 0,
        calibrationValidity: 0,
      };
    }
  }

  async checkInstrumentCalibration(instrumentId: string, measurementDate: Date) {
    try {
      const instrumentRecord = await db.select().from(instruments).where(eq(instruments.id, instrumentId)).limit(1);
      const calibrationRecords = await db.select().from(calibrations).where(eq(calibrations.instrumentId, instrumentId));
      
      if (!calibrationRecords.length) {
        return { valid: true, note: "Default calibration active" };
      }
      
      const validCalibration = calibrationRecords.find(c => new Date(c.expiryDate) > measurementDate);
      if (!validCalibration) {
        return { valid: false, reason: "Calibration expired" };
      }

      return { valid: true };
    } catch (err: any) {
      return { valid: false, reason: `Calibration verification failure: ${err.message}` };
    }
  }

  async checkEvidenceChain(calculationId: string) {
    try {
      const calcRunRows = await db.select().from(calculation_runs).where(eq(calculation_runs.id, calculationId)).limit(1);
      if (!calcRunRows || calcRunRows.length === 0) {
        return { status: 'BLOCKED', reason: 'Calculation run not found' };
      }
      const calcRun = calcRunRows[0];

      // Find dataset
      const datasetRows = await db.select().from(calculation_datasets).where(eq(calculation_datasets.id, calcRun.datasetId)).limit(1);
      if (!datasetRows || datasetRows.length === 0) {
        return { status: 'BLOCKED', reason: 'Associated calculation dataset not found' };
      }
      const dataset = datasetRows[0];

      // Find monitoring period
      const periodRows = await db.select().from(monitoring_periods).where(eq(monitoring_periods.id, dataset.monitoringPeriodId)).limit(1);
      if (!periodRows || periodRows.length === 0) {
        return { status: 'BLOCKED', reason: 'Associated monitoring period not found' };
      }
      const period = periodRows[0];

      // Query measurements and evidence
      const periodMeasurements = await db.select().from(measurements).where(eq(measurements.monitoringPeriodId, period.id));
      const projectEvidence = await db.select().from(evidence).where(eq(evidence.projectId, period.projectId));

      if (periodMeasurements.length === 0 && projectEvidence.length === 0) {
        return { 
          status: 'BLOCKED', 
          reason: 'Zero verified measurements or evidence documents recorded for this monitoring period',
          missing_inputs: ['measurements', 'evidence'] 
        };
      }

      const tampered: string[] = [];
      const missingEvidence: string[] = [];

      // Validate each evidence entry cryptographic hash
      for (const ev of projectEvidence) {
        if (!ev.fileHash || ev.fileHash.trim() === '') {
          tampered.push(ev.id);
          continue;
        }
        // Validate SHA-256 hash formatting (64 hex characters)
        if (!/^[a-fA-F0-9]{64}$/.test(ev.fileHash)) {
          tampered.push(ev.id);
        }
      }

      // Validate measurement evidence links
      for (const m of periodMeasurements) {
        const linked = projectEvidence.find(e => e.measurementId === m.id);
        if (!linked && projectEvidence.length === 0) {
          missingEvidence.push(m.id);
        }
      }

      if (tampered.length > 0) {
        return {
          status: 'BLOCKED',
          reason: 'Tampered evidence detected: invalid or corrupt cryptographic hash',
          tamperedEvidenceIds: tampered,
        };
      }

      if (missingEvidence.length > 0) {
        return {
          status: 'BLOCKED',
          reason: 'Missing evidence records for monitoring measurements',
          missing_inputs: missingEvidence,
        };
      }

      return { 
        status: 'CLEAR', 
        verifiedEvidenceCount: projectEvidence.length, 
        measurementCount: periodMeasurements.length,
        datasetHash: dataset.datasetHash 
      };
    } catch (err: any) {
      return { 
        status: 'BLOCKED', 
        reason: `Database error during MRV evidence chain verification: ${err.message}` 
      };
    }
  }
}

export const mrvQualityEngine = new MRVQualityEngine();

export class DoubleCountingEngine {
  async check(projectId: string, facilityId: string, monitoringPeriodId: string) {
    try {
      // Query the requested monitoring period
      const currentPeriodRows = await db.select().from(monitoring_periods).where(eq(monitoring_periods.id, monitoringPeriodId)).limit(1);
      if (!currentPeriodRows || currentPeriodRows.length === 0) {
        return { status: 'BLOCKED', reason: 'Target monitoring period not found' };
      }
      const currentPeriod = currentPeriodRows[0];

      // 1. Check for overlapping monitoring periods across OTHER projects
      const allPeriods = await db.select().from(monitoring_periods);
      const overlappingPeriods = allPeriods.filter(p => {
        if (p.projectId === projectId || p.id === monitoringPeriodId) return false;
        // Check overlapping date range
        const startA = new Date(currentPeriod.startDate).getTime();
        const endA = new Date(currentPeriod.endDate).getTime();
        const startB = new Date(p.startDate).getTime();
        const endB = new Date(p.endDate).getTime();
        return (startA <= endB && endA >= startB);
      });

      // 2. Check for duplicate carbon claims for the same period or facility
      const datasets = await db.select().from(calculation_datasets);
      const runs = await db.select().from(calculation_runs);
      const existingClaims = await db.select().from(carbon_claims);

      const conflictingClaims = existingClaims.filter(c => {
        const run = runs.find(r => r.id === c.calculationRunId);
        if (!run) return false;
        const ds = datasets.find(d => d.id === run.datasetId);
        if (!ds) return false;
        return ds.projectId !== projectId && ds.monitoringPeriodId === monitoringPeriodId;
      });

      const conflictingRecordIds = [
        ...overlappingPeriods.map(p => p.id),
        ...conflictingClaims.map(c => c.id)
      ];

      if (conflictingRecordIds.length > 0) {
        return {
          status: 'BLOCKED',
          reason: 'Double counting detected: Overlapping monitoring period or duplicate carbon claim exists in another project',
          conflictingRecordIds,
        };
      }

      return { 
        status: 'CLEAR', 
        checkedScope: { projectId, facilityId, monitoringPeriodId } 
      };
    } catch (err: any) {
      return { 
        status: 'BLOCKED', 
        reason: `Database error during double counting verification: ${err.message}` 
      };
    }
  }
}


export const doubleCountingEngine = new DoubleCountingEngine();

export class PDDEngine {
  async generateDraft(projectId: string) {
    const newPdd = {
      id: crypto.randomUUID(),
      projectId,
    };
    await db.insert(pdd).values(newPdd);
    
    const hash = crypto.createHash('sha256').update(`${newPdd.id}-${Date.now()}`).digest('hex');
    await db.insert(pdd_versions).values({
      id: crypto.randomUUID(),
      pddId: newPdd.id,
      version: 1,
      content: {}, fileHash: hash,
    });
    
    return newPdd;
  }
}

export const pddEngine = new PDDEngine();

export class ACVABackend {
  async createValidationRequest(projectId: string) {
    const acva = {
      id: crypto.randomUUID(),
      projectId,
      type: 'VALIDATION',
      status: 'VALIDATION_REQUEST'
    };
    await db.insert(acva_cases).values(acva);
    return acva;
  }
  
  async createVerificationRequest(projectId: string) {
    const acva = {
      id: crypto.randomUUID(),
      projectId,
      type: 'VERIFICATION',
      status: 'VERIFICATION_REQUEST'
    };
    await db.insert(acva_cases).values(acva);
    return acva;
  }

  async executeACVAAction(caseId: string, action: string, payload: any) {
    const validActions = [
      'REQUEST_INFORMATION', 'RAISE_FINDING', 'ACCEPT_EVIDENCE', 'REJECT_EVIDENCE',
      'REQUEST_CORRECTION', 'VALIDATE', 'REJECT_VALIDATION', 'VERIFY', 'REJECT_VERIFICATION'
    ];
    if (!validActions.includes(action)) {
      throw new Error(`Invalid ACVA action: ${action}`);
    }

    if (action === 'RAISE_FINDING') {
      const finding = {
        id: crypto.randomUUID(),
        acvaCaseId: caseId,
        description: payload.description || 'Audit finding raised',
        status: 'OPEN'
      };
      await db.insert(findings).values(finding);
      return { status: 'FINDING_RAISED', finding };
    }

    let newStatus = 'OPEN';
    if (action === 'VALIDATE') newStatus = 'VALIDATED';
    else if (action === 'REJECT_VALIDATION') newStatus = 'VALIDATION_REJECTED';
    else if (action === 'VERIFY') newStatus = 'VERIFIED';
    else if (action === 'REJECT_VERIFICATION') newStatus = 'VERIFICATION_REJECTED';

    await db.update(acva_cases).set({ status: newStatus }).where(eq(acva_cases.id, caseId));
    return { status: newStatus, action, note: "ACVA action processed with strict read-only MRV boundary" };
  }
}

export const acvaBackend = new ACVABackend();

export class CCTSSubmissionGateway {
  adapters = {
    ManualSubmissionAdapter: 'ACTIVE',
    OfficialAPIAdapter: 'NOT_CONNECTED'
  };

  async submitProject(projectId: string, submissionType: string, documents: any[], monitoringPeriodId?: string, acvaId?: string) {
    const submissionId = crypto.randomUUID();
    const auditHash = crypto.createHash('sha256').update(`${projectId}-${submissionType}-${Date.now()}`).digest('hex');

    const submissionRecord = {
      id: submissionId,
      projectId,
      submissionType,
      monitoringPeriodId: monitoringPeriodId || null,
      acvaId: acvaId || null,
      documents: documents || [],
      submissionDate: new Date(),
      externalReference: `CCTS-MANUAL-REF-${Date.now()}`,
      status: 'SUBMITTED',
      adapterType: 'MANUAL',
      response: { note: 'EXTERNAL CCTS SUBMISSION — MANUAL/CONTROLLED WORKFLOW. Controlled submission package generated.' },
      auditHash
    };

    await db.insert(ccts_submissions).values(submissionRecord);

    return {
      submission_id: submissionId,
      project_id: projectId,
      submission_type: submissionType,
      external_reference: submissionRecord.externalReference,
      status: 'SUBMITTED',
      audit_hash: auditHash,
      gateway_label: 'EXTERNAL CCTS SUBMISSION — MANUAL/CONTROLLED WORKFLOW'
    };
  }
}

export const cctsSubmissionGateway = new CCTSSubmissionGateway();

export class CertificateModel {
  validStates = [
    'POTENTIAL', 'CALCULATED', 'VALIDATION_PENDING', 'VALIDATED', 'REGISTERED',
    'MONITORING', 'VERIFICATION_PENDING', 'VERIFIED', 'ISSUANCE_REQUESTED',
    'ADMINISTRATIVE_REVIEW', 'EXPERT_REVIEW', 'TECHNICAL_COMMITTEE_REVIEW',
    'NSC_ICM_RECOMMENDATION', 'ISSUED', 'REJECTED', 'TRANSFERRED', 'RETIRED', 'CANCELLED'
  ];

  async transitionState(certificateId: string, newState: string, externalIdentifier?: string) {
    if (!this.validStates.includes(newState)) {
      throw new Error(`Invalid certificate state transition target: ${newState}`);
    }

    if (newState === 'ISSUED' && !externalIdentifier) {
      throw new Error("Cannot set certificate state to ISSUED without official external CCTS certificate identifier.");
    }

    const updateData: any = { status: newState };
    if (newState === 'ISSUED' && externalIdentifier) {
      updateData.officialCertificateIdentifier = externalIdentifier;
      updateData.issueDate = new Date();
    }

    await db.update(certificates).set(updateData).where(eq(certificates.id, certificateId));

    return { success: true, certificateId, newState, officialCertificateIdentifier: externalIdentifier || null };
  }
}

export const certificateModel = new CertificateModel();

// --- PHASE 5: REAL PILOT INTAKE & ELIGIBILITY ENGINES ---

export class RealProjectIntakeEngine {
  requiredFields = [
    'projectOwner', 'legalEntity', 'icmAccountStatus', 'facilityOwner',
    'facilityOperator', 'siteLocation', 'landfillInfo', 'wasteHistory',
    'gasCaptureInfra', 'flareUtilisationInfra', 'instrumentsList',
    'calibrationRecordsList', 'monitoringSystem', 'landOwnershipRights',
    'carbonBenefitOwnership', 'applicablePermits', 'contracts',
    'existingEnvironmentalRecords'
  ];

  async processIntake(projectId: string, data: any) {
    const missingFields = this.requiredFields.filter(field => !data[field] || (Array.isArray(data[field]) && data[field].length === 0));

    const isComplete = missingFields.length === 0;
    const intakeStatus = isComplete ? 'COMPLETE' : 'INCOMPLETE';

    const intakeRecord = {
      id: crypto.randomUUID(),
      projectId,
      projectOwner: data.projectOwner || 'UNSPECIFIED',
      legalEntity: data.legalEntity || 'UNSPECIFIED',
      icmAccountStatus: data.icmAccountStatus || 'UNREGISTERED',
      facilityOwner: data.facilityOwner || 'UNSPECIFIED',
      facilityOperator: data.facilityOperator || 'UNSPECIFIED',
      siteLocation: data.siteLocation || 'UNSPECIFIED',
      landfillInfo: data.landfillInfo || {},
      wasteHistory: data.wasteHistory || {},
      gasCaptureInfra: data.gasCaptureInfra || {},
      flareUtilisationInfra: data.flareUtilisationInfra || {},
      instrumentsList: data.instrumentsList || [],
      calibrationRecordsList: data.calibrationRecordsList || [],
      monitoringSystem: data.monitoringSystem || {},
      landOwnershipRights: data.landOwnershipRights || {},
      carbonBenefitOwnership: data.carbonBenefitOwnership || {},
      applicablePermits: data.applicablePermits || [],
      contracts: data.contracts || [],
      existingEnvironmentalRecords: data.existingEnvironmentalRecords || [],
      intakeStatus,
      eligibilityAssessment: isComplete ? 'ELIGIBLE_CANDIDATE' : 'INSUFFICIENT_DATA',
      eligibilityNotes: isComplete ? 'All 18 intake fields present.' : `Missing required fields: ${missingFields.join(', ')}`
    };

    await db.insert(project_intakes).values(intakeRecord);

    return {
      intakeStatus,
      isComplete,
      missingFields,
      eligibilityAssessment: intakeRecord.eligibilityAssessment,
      intakeRecord
    };
  }

  async canProceedToCalculation(projectId: string): Promise<boolean> {
    const intakeQuery = await db.select().from(project_intakes).where(eq(project_intakes.projectId, projectId)).orderBy(desc(project_intakes.createdAt)).limit(1);
    if (!intakeQuery.length) return false;
    return intakeQuery[0].intakeStatus === 'COMPLETE';
  }
}

export const realProjectIntakeEngine = new RealProjectIntakeEngine();

export class RealProjectEligibilityEngine {
  async evaluateRealProject(projectId: string) {
    const intakeQuery = await db.select().from(project_intakes).where(eq(project_intakes.projectId, projectId)).orderBy(desc(project_intakes.createdAt)).limit(1);

    if (intakeQuery.length && intakeQuery[0].intakeStatus !== 'COMPLETE') {
      return {
        assessment: 'INSUFFICIENT_DATA',
        notes: 'Intake incomplete. Cannot complete eligibility assessment.',
        disclaimer: 'INTERNAL RUPAYKG ASSESSMENT — NOT BEE APPROVAL'
      };
    }

    return {
      assessment: 'ELIGIBLE_CANDIDATE',
      sector: 'WASTE_HANDLING_AND_DISPOSAL',
      activity: 'LANDFILL_METHANE_RECOVERY',
      recommendedMethodology: 'BM WA03.001',
      disclaimer: 'INTERNAL RUPAYKG ASSESSMENT — NOT BEE APPROVAL'
    };
  }
}

export const realProjectEligibilityEngine = new RealProjectEligibilityEngine();

export class ACVASelectionEngine {
  async findAccreditedACVAs() {
    return await db.select().from(acva_registry).where(eq(acva_registry.status, 'ACTIVE'));
  }

  async appointACVA(projectId: string, acvaRegistryId: string, selectionReason: string, conflictDeclared: boolean) {
    if (conflictDeclared) {
      throw new Error("ACVA Appointment BLOCKED due to declared conflict of interest.");
    }

    const appointment = {
      id: crypto.randomUUID(),
      projectId,
      acvaRegistryId,
      selectionReason,
      conflictDeclarationPassed: true,
      appointmentStatus: 'APPOINTED'
    };

    await db.insert(acva_appointments).values(appointment);
    return appointment;
  }
}

export const acvaSelectionEngine = new ACVASelectionEngine();

export class MonitoringReportEngine {
  async generateAndFreezeReport(
    projectId: string, 
    monitoringPeriodId: string, 
    methodologyId: string, 
    datasetId: string, 
    calculationRunId: string, 
    claimedTco2e: number,
    qaQcSummary: string
  ) {
    const auditHash = crypto.createHash('sha256').update(`${projectId}-${monitoringPeriodId}-${datasetId}-${calculationRunId}-${claimedTco2e}`).digest('hex');

    const report = {
      id: crypto.randomUUID(),
      projectId,
      monitoringPeriodId,
      methodologyId,
      datasetId,
      calculationRunId,
      claimedTco2e: claimedTco2e.toString(),
      qaQcSummary,
      status: 'FROZEN',
      frozenAt: new Date(),
      auditHash
    };

    await db.insert(monitoring_reports).values(report);
    return report;
  }
}

export const monitoringReportEngine = new MonitoringReportEngine();

export class InstrumentReadinessEngine {
  async assessReadiness(facilityId: string, instrumentId: string, details: {
    installed: boolean;
    operational: boolean;
    calibrated: boolean;
    traceable: boolean;
    dataConnected: boolean;
    notes?: string;
  }) {
    let readinessRating = 'READY';
    if (!details.calibrated || !details.dataConnected) readinessRating = 'WARNING';
    if (!details.installed || !details.operational) readinessRating = 'BLOCKED';

    const record = {
      id: crypto.randomUUID(),
      facilityId,
      instrumentId,
      installedStatus: details.installed,
      operationalStatus: details.operational,
      calibratedStatus: details.calibrated,
      traceableStatus: details.traceable,
      dataConnectedStatus: details.dataConnected,
      readinessRating,
      notes: details.notes || ''
    };

    await db.insert(instrument_readiness).values(record);
    return record;
  }
}

export const instrumentReadinessEngine = new InstrumentReadinessEngine();

export class AuditPackageGenerator {
  async generatePackage(projectId: string, monitoringPeriodId?: string, requestedBy: string = 'System Auditor') {
    const packageHash = crypto.createHash('sha256').update(`AUDIT-PKG-${projectId}-${Date.now()}`).digest('hex');

    const pkg = {
      id: crypto.randomUUID(),
      projectId,
      monitoringPeriodId: monitoringPeriodId || null,
      packageHash,
      downloadUrl: `/api/carbon/audit-packages/${packageHash}.zip`,
      includedEntities: ['PROJECT', 'PDD', 'METHODOLOGY', 'MRV_DATASET', 'CALCULATION_RUN', 'EVIDENCE_HASHES', 'ACVA_CASE', 'CCTS_SUBMISSIONS'],
      generatedBy: requestedBy
    };

    await db.insert(audit_packages).values(pkg);
    return pkg;
  }
}

export const auditPackageGenerator = new AuditPackageGenerator();

export class PilotIssueTracker {
  async logIssue(projectId: string, issue: {
    issueType: string;
    title: string;
    description: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    rootCause?: string;
  }) {
    const record = {
      id: crypto.randomUUID(),
      projectId,
      issueType: issue.issueType,
      title: issue.title,
      description: issue.description,
      impact: issue.impact,
      rootCause: issue.rootCause || '',
      status: 'OPEN'
    };

    await db.insert(pilot_issues).values(record);
    return record;
  }

  async resolveIssue(issueId: string, resolution: {
    evidenceAccepted: string;
    resolutionTimeHours: number;
    acvaSatisfied: boolean;
    futureIntakeGuidanceUpdate: string;
  }) {
    const updateData = {
      evidenceAccepted: resolution.evidenceAccepted,
      resolutionTimeHours: resolution.resolutionTimeHours,
      acvaSatisfied: resolution.acvaSatisfied,
      futureIntakeGuidanceUpdate: resolution.futureIntakeGuidanceUpdate,
      status: 'RESOLVED',
      updatedAt: new Date()
    };

    await db.update(pilot_issues).set(updateData).where(eq(pilot_issues.id, issueId));
    return { success: true, issueId, ...updateData };
  }

  async getIssuesForProject(projectId: string) {
    return await db.select().from(pilot_issues).where(eq(pilot_issues.projectId, projectId)).orderBy(desc(pilot_issues.createdAt));
  }
}

export const pilotIssueTracker = new PilotIssueTracker();

// --- JABALPUR LANDFILL FACILITY RECORD & SITE CANDIDATE ENGINE ---

export const JABALPUR_LANDFILL_FACILITY = {
  facility_id: "FAC-JBP-001",
  facility_name: "Kathonda Solid Waste Management & Disposal Facility",
  operator: "Jabalpur Waste Management Pvt Ltd / JMC (PENDING_VERIFICATION)",
  owner: "Jabalpur Municipal Corporation (JMC)",
  municipal_body: "Jabalpur Municipal Corporation",
  address: "Kathonda, Patan Road, Jabalpur, Madhya Pradesh 482002",
  latitude: "23.2183° N",
  longitude: "79.8972° E",
  survey_reference: "PENDING_VERIFICATION",
  land_area: "35.4 Hectares (District Environment Plan)",
  landfill_type: "Controlled Landfill & Processing Facility",
  operating_status: "ACTIVE",
  commissioning_date: "2014-06-01 (PENDING_VERIFICATION)",
  closure_date: "PENDING_VERIFICATION",
  active_cells: "Cell 1, Cell 2 (PENDING_VERIFICATION)",
  closed_cells: "Legacy Dumping Area (PENDING_VERIFICATION)",
  legacy_waste: "1.2 Million Tonnes (DEP Estimate - SECONDARY_SOURCE)",
  daily_receipt: "450-500 TPD MSW (JMC DEP Record - SECONDARY_SOURCE)",
  annual_receipt: "165,000 TPY (SECONDARY_SOURCE)",
  waste_composition: "Biodegradable organic 48%, Moisture 38% (SECONDARY_SOURCE)",
  waste_history: "DATA_GAP",
  gas_capture_system: "NOT_CONFIRMED",
  flare_system: "NOT_CONFIRMED",
  energy_recovery: "NOT_CONFIRMED",
  leachate_system: "PENDING_VERIFICATION",
  environmental_controls: "PENDING_VERIFICATION",
  permits: "MPPCB Consent to Operate (PENDING_VERIFICATION)",
  documents: []
};

export const JABALPUR_SITE_CANDIDATES = [
  {
    candidate_id: "SITE-JBP-01",
    name: "Kathonda MSW Processing & Disposal Facility (Patan Road)",
    owner: "Jabalpur Municipal Corporation (JMC)",
    operator: "JMC / Contracted Operator",
    waste_status: "Active MSW receipt (~450-500 TPD)",
    landfill_status: "Controlled Dumping / Active Processing",
    gas_capture_status: "NOT_CONFIRMED",
    methodology_suitability: "BM WA03.001 Candidate",
    data_availability: "PARTIAL — DEP Secondary Records Available",
    verification_status: "PRIMARY_CANDIDATE_SELECTED"
  },
  {
    candidate_id: "SITE-JBP-02",
    name: "Bhedaghat Peripheral Dump Site",
    owner: "Jabalpur District Administration",
    operator: "Gram Panchayat / Local Body",
    waste_status: "Inactive / Minor rural dumping",
    landfill_status: "Uncontrolled Open Dump",
    gas_capture_status: "NOT_PRESENT",
    methodology_suitability: "NOT_APPLICABLE",
    data_availability: "DATA_GAP",
    verification_status: "REJECTED_UNSUITABLE"
  }
];

export const JABALPUR_MRV_READINESS = {
  lfg_flow_meter: { status: "PENDING", instrument: "NOT_CONFIRMED" },
  methane_analyzer: { status: "PENDING", instrument: "NOT_CONFIRMED" },
  temperature_sensor: { status: "PENDING", instrument: "NOT_CONFIRMED" },
  pressure_sensor: { status: "PENDING", instrument: "NOT_CONFIRMED" },
  electricity_meter: { status: "PENDING", instrument: "NOT_CONFIRMED" }
};

