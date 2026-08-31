import { CCTSReadinessAssessment, CCTSReadinessStatus } from '../../types.ts';
import { randomBytesHex, hashStringHex } from '../../utils/cryptoUtils.ts';

/**
 * LEGACY / SANDBOX REGISTRY GATEWAY — QUARANTINED.
 *
 * This implementation used browser localStorage and synthetic CCTS issuance
 * records. It is NOT an authoritative registry integration and must not be
 * used by production code.
 */
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
    const initial: RegistryProjectSubmission[] = [];
    localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(initial));
    return initial;
  }

  static getProjectSubmissions(projectId?: string): RegistryProjectSubmission[] {
    const list = this.getSubmissions();
    if (projectId) return list.filter(s => s.projectId === projectId);
    return list;
  }

  static submitToCCTS(assessment: CCTSReadinessAssessment, totalCredits: number): RegistryProjectSubmission {
    const list = this.getSubmissions();
    const isReady = assessment?.status === CCTSReadinessStatus.READY || assessment?.status === CCTSReadinessStatus.CONDITIONALLY_READY;
    const status = isReady ? 'UNDER_REVIEW' : 'REJECTED';
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
      notes: isReady ? 'Legacy sandbox submission record only.' : 'Submission blocked: project not ready.'
    };
    list.unshift(newSubmission);
    localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(list));
    return newSubmission;
  }

  static approveAndIssueCredits(submissionId: string): RegistryProjectSubmission {
    const list = this.getSubmissions();
    const sub = list.find(s => s.submissionId === submissionId);
    if (!sub) throw new Error('Submission not found');
    if (sub.status === 'UNDER_REVIEW') {
      sub.status = 'ISSUED';
      sub.creditsIssued = sub.totalCreditsRequested;
      sub.transactionHash = `0xbee_ccts_${hashStringHex(`${sub.submissionId}:${sub.projectId}:${sub.totalCreditsRequested}`).substring(0, 24)}`;
      sub.notes = 'Legacy sandbox issuance record — not an authoritative registry issuance.';
    }
    localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(list));
    return sub;
  }
}
