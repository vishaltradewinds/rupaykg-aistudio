import { CCTSReadinessAssessment, CCTSReadinessStatus } from '../types';
import { randomBytesHex } from '../utils/cryptoUtils';

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
 * Registry gateway boundary. This legacy UI adapter is sandbox-only and
 * cannot assert that BEE/ICM received a submission or issued certificates.
 * Authoritative issuance must come from the configured registry adapter.
 */
export class RegistryGatewayAdapter {
  private static SUBMISSIONS_KEY = 'rupaykg_registry_submissions';

  private static getSubmissions(): RegistryProjectSubmission[] {
    try {
      const data = localStorage.getItem(this.SUBMISSIONS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) { console.error(e); }
    return this.seedInitialSubmissions();
  }

  private static seedInitialSubmissions(): RegistryProjectSubmission[] {
    const initial: RegistryProjectSubmission[] = [];
    localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(initial));
    return initial;
  }

  static getProjectSubmissions(projectId?: string): RegistryProjectSubmission[] {
    const list = this.getSubmissions();
    return projectId ? list.filter(s => s.projectId === projectId) : list;
  }

  static submitToCCTS(assessment: CCTSReadinessAssessment, totalCredits: number): RegistryProjectSubmission {
    const list = this.getSubmissions();
    const isReady = assessment?.status === CCTSReadinessStatus.READY || assessment?.status === CCTSReadinessStatus.CONDITIONALLY_READY;
    const status = isReady ? 'UNDER_REVIEW' : 'REJECTED';
    const notes = isReady
      ? 'Sandbox payload prepared locally. No BEE/ICM submission, verification or issuance is asserted.'
      : 'Submission blocked: project does not meet local CCTS readiness criteria.';
    const newSubmission: RegistryProjectSubmission = {
      submissionId: `SUB_CCTS_${randomBytesHex(3).toUpperCase()}`,
      projectId: assessment.projectId,
      registryName: 'INDIA_CCTS',
      status,
      submittedAt: new Date().toISOString(),
      assessedScore: assessment.overallScore,
      totalCreditsRequested: totalCredits,
      creditsIssued: 0,
      isSandbox: true,
      notes,
    };
    list.unshift(newSubmission);
    localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(list));
    return newSubmission;
  }

  /** Authoritative issuance cannot be performed by a local/sandbox adapter. */
  static approveAndIssueCredits(_submissionId: string): never {
    throw new Error('AUTHORITATIVE_REGISTRY_REQUIRED');
  }
}
