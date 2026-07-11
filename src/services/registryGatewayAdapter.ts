import { MRVEvent, EvidenceRecord, CCTSReadinessAssessment, CCTSReadinessStatus } from '../types';
import crypto from 'crypto';

export interface RegistryProjectSubmission {
  submissionId: string;
  projectId: string;
  registryName: 'INDIA_CCTS' | 'UNFCCC_CDM' | 'VERRA' | 'GOLD_STANDARD';
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ISSUED' | 'REJECTED';
  submittedAt: string;
  assessedScore: number;
  totalCreditsRequested: number;
  creditsIssued: number;
  transactionHash?: string;
  isSandbox: boolean;
  notes: string;
}

/**
 * ========================================================
 * REGISTRY GATEWAY ADAPTER (Enterprise 3.0 Module)
 * ========================================================
 * Standardizes communication with global and domestic carbon registries.
 * Enables automatic CCTS schema serialization and payload submission checks.
 */
export class RegistryGatewayAdapter {
  private static SUBMISSIONS_KEY = 'rupaykg_registry_submissions';

  private static getSubmissions(): RegistryProjectSubmission[] {
    try {
      const data = localStorage.getItem(this.SUBMISSIONS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return this.seedInitialSubmissions();
  }

  private static seedInitialSubmissions(): RegistryProjectSubmission[] {
    const initial: RegistryProjectSubmission[] = [
      {
        submissionId: 'SUB_CCTS_001',
        projectId: 'PROJ_EAST_MUNI_COMPOST',
        registryName: 'INDIA_CCTS',
        status: 'ISSUED',
        submittedAt: '2026-02-14T08:30:00.000Z',
        assessedScore: 100,
        totalCreditsRequested: 1450,
        creditsIssued: 1450,
        transactionHash: '0xbee_ccts_8bf4c1a2d3e9f0c2a8b9e07f',
        isSandbox: true,
        notes: 'National CCTS registry successfully verified composting methane avoidance records'
      },
      {
        submissionId: 'SUB_CDM_002',
        projectId: 'PROJ_PUNJAB_STUBBLE_BURN',
        registryName: 'UNFCCC_CDM',
        status: 'UNDER_REVIEW',
        submittedAt: '2026-03-01T11:15:00.000Z',
        assessedScore: 90,
        totalCreditsRequested: 840,
        creditsIssued: 0,
        isSandbox: true,
        notes: 'Small-scale crop residue aggregation pipeline awaiting final UNFCCC EB panel review'
      }
    ];
    localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(initial));
    return initial;
  }

  static getProjectSubmissions(projectId?: string): RegistryProjectSubmission[] {
    const list = this.getSubmissions();
    if (projectId) return list.filter(s => s.projectId === projectId);
    return list;
  }

  /**
   * Evaluates the CCTS compliance-readiness profile of a project and submits it to CCTS
   * if compliance criteria are satisfied.
   */
  static submitToCCTS(
    assessment: CCTSReadinessAssessment,
    totalCredits: number
  ): RegistryProjectSubmission {
    const list = this.getSubmissions();

    const isReady = assessment.status === CCTSReadinessStatus.READY || assessment.status === CCTSReadinessStatus.CONDITIONALLY_READY;
    const status = isReady ? 'UNDER_REVIEW' : 'REJECTED';
    const notes = isReady 
      ? 'Payload successfully received by National Bureau of Energy Efficiency (BEE) Gateway. Entered verification queue.' 
      : 'Submission blocked: Project does not meet CCTS compliance criteria. Clear open verification findings first.';

    const newSubmission: RegistryProjectSubmission = {
      submissionId: `SUB_CCTS_${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      projectId: assessment.projectId,
      registryName: 'INDIA_CCTS',
      status,
      submittedAt: new Date().toISOString(),
      assessedScore: assessment.overallScore,
      totalCreditsRequested: totalCredits,
      creditsIssued: 0,
      isSandbox: true,
      notes
    };

    list.unshift(newSubmission);
    localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(list));
    return newSubmission;
  }

  /**
   * Mock triggers issuance of carbon certificates on the registry if verification is fully clear.
   */
  static triggerMockIssuance(submissionId: string): RegistryProjectSubmission {
    const list = this.getSubmissions();
    const sub = list.find(s => s.submissionId === submissionId);
    if (!sub) throw new Error('Submission not found');

    if (sub.status === 'UNDER_REVIEW') {
      sub.status = 'ISSUED';
      sub.creditsIssued = sub.totalCreditsRequested;
      sub.transactionHash = `0xbee_ccts_${crypto.randomBytes(12).toString('hex')}`;
      sub.notes = 'Official CCTS Compliance Credits minted successfully inside National carbon depository.';
    }

    localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(list));
    return sub;
  }
}
