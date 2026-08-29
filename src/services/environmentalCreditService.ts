// ========================================================
// RUPAYKG ENVIRONMENTAL CREDIT ROUTER
// ========================================================
// One evidence/MRV platform, multiple government pathways.
// RupayKg does NOT issue CCCs or Green Credits.
//
// CCTS path: RupayKg -> ACVA -> BEE/ICM -> CCC
// GCP path:  RupayKg -> GCP/ICFRE process -> Green Credit
// ========================================================

import { ICMComplianceService, ICM_METHODOLOGIES, CCTS_ACVAS } from "./icmComplianceService";

export type EnvironmentalCreditPathway = "CCTS_CCC" | "GREEN_CREDIT" | "MRV_ONLY";
export type OperatingContext = "urban" | "rural";

export interface GreenCreditMethodology {
  id: string;
  name: string;
  status: "notified";
  administrator: "ICFRE";
  authority: "MoEFCC";
  activity: string;
  creditRule: string;
  eligibility: string[];
  evidence: string[];
  officialPortal: string;
}

/**
 * Currently notified GCP methodology implemented by the platform router.
 * The 22-Feb-2024 notification is the source of truth; draft methodology
 * proposals must not be treated as production eligibility rules.
 */
export const GREEN_CREDIT_METHODOLOGIES: GreenCreditMethodology[] = [
  {
    id: "GCP-TREE-PLANTATION-2024",
    name: "Green Credit for Tree Plantation",
    status: "notified",
    administrator: "ICFRE",
    authority: "MoEFCC",
    activity: "Tree plantation on eligible degraded land parcels identified by State/UT Forest Departments under the GCP process.",
    creditRule: "One Green Credit per tree grown, subject to the notified methodology's minimum density and Forest Department completion certification.",
    eligibility: [
      "Land parcel must be identified through the GCP process by the Forest Department.",
      "Land parcel must be free from encumbrances.",
      "Notified methodology requires a land parcel size of at least 5 hectares.",
      "Plantation must follow the applicable management/working plan and notified methodology."
    ],
    evidence: [
      "GCP application/project reference",
      "Assigned land parcel and GIS coordinates",
      "Forest Department land identification",
      "Plantation proposal and payment/demand-note records where applicable",
      "Plantation completion report/certificate",
      "Tree count and density evidence",
      "Monitoring/verification records"
    ],
    officialPortal: "https://moefcc-gcp.in/"
  }
];

export interface EnvironmentalRoutingResult {
  pathway: EnvironmentalCreditPathway;
  eligible: boolean;
  status: "eligible_route" | "mrv_only" | "needs_project_review";
  reason: string;
  methodologyId?: string;
  authority?: string;
  issuer?: string;
  nextStep: string;
}

export interface EnvironmentalActivityInput {
  context: OperatingContext;
  activityType: string;
  wasteType?: string;
  methodologyId?: string;
  greenCreditMethodologyId?: string;
}

export class EnvironmentalCreditService {
  static route(activity: EnvironmentalActivityInput): EnvironmentalRoutingResult {
    // Explicitly selected CCTS methodology: validate against current BEE catalogue.
    if (activity.methodologyId) {
      const methodology = Object.values(ICM_METHODOLOGIES)
        .flat()
        .find(m => m.methodologyId === activity.methodologyId);

      if (!methodology) {
        return {
          pathway: "MRV_ONLY",
          eligible: false,
          status: "needs_project_review",
          reason: "Selected methodology is not in the current BEE-approved CCTS catalogue.",
          nextStep: "Keep the activity in MRV-only status until a current BEE-approved methodology is selected."
        };
      }

      return {
        pathway: "CCTS_CCC",
        eligible: true,
        status: "eligible_route",
        reason: `Activity is routed to the BEE CCTS methodology ${methodology.methodologyId}. This is not a CCC issuance decision.`,
        methodologyId: methodology.methodologyId,
        authority: "BEE / Indian Carbon Market",
        issuer: "BEE",
        nextStep: "Complete methodology-specific project documentation and monitoring, obtain applicable ACVA validation/verification, then follow the BEE/ICM issuance process."
      };
    }

    // GCP tree plantation: do not infer eligibility from a tree count alone.
    if (activity.greenCreditMethodologyId === "GCP-TREE-PLANTATION-2024") {
      return {
        pathway: "GREEN_CREDIT",
        eligible: true,
        status: "needs_project_review",
        reason: "Routed to the notified GCP tree-plantation methodology; final eligibility depends on the GCP/Forest Department land assignment and notified requirements.",
        methodologyId: "GCP-TREE-PLANTATION-2024",
        authority: "MoEFCC",
        issuer: "ICFRE / Green Credit Programme process",
        nextStep: "Use the official GCP process for land assignment, proposal, payment, plantation completion and verification/issuance. RupayKg records evidence and status only."
      };
    }

    // Safe automatic routing for the two strongest RupayKg pathways.
    const suggestion = ICMComplianceService.suggestMethodology(activity.wasteType || activity.activityType, activity.context);
    if (suggestion.status === "methodology_match") {
      return {
        pathway: "CCTS_CCC",
        eligible: false,
        status: "needs_project_review",
        reason: `A current BEE methodology appears relevant (${suggestion.methodologyId}), but RupayKg must not infer project eligibility or credit quantity from activity data alone.`,
        methodologyId: suggestion.methodologyId,
        authority: "BEE / Indian Carbon Market",
        issuer: "BEE",
        nextStep: "Open a CCTS project eligibility review and collect the methodology-specific evidence before ACVA engagement."
      };
    }

    return {
      pathway: "MRV_ONLY",
      eligible: false,
      status: "mrv_only",
      reason: "No currently configured government credit methodology can be defensibly assigned from the supplied activity data.",
      nextStep: "Continue evidence capture and MRV; do not label the activity as a CCC or Green Credit generating activity."
    };
  }

  static getCctsMethodologies() {
    return ICM_METHODOLOGIES;
  }

  static getCctsAcvas() {
    return CCTS_ACVAS;
  }

  static getGreenCreditMethodologies() {
    return GREEN_CREDIT_METHODOLOGIES;
  }
}
