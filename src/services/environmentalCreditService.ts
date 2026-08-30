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
  status: "operational";
  administrator: "ICFRE";
  authority: "MoEFCC";
  activity: string;
  creditRule: string;
  tradable: false;
  transferable: false;
  eligibility: string[];
  evidence: string[];
  officialPortal: string;
}

/**
 * Current operational GCP pathway reflected by the official GCP portal.
 * The 2025 revised modalities cover eco-restoration of degraded forest land.
 * Other GCP sectors may exist in the programme framework but are not treated
 * as production issuance pathways until the Administrator operationalises them.
 *
 * IMPORTANT: current GCP FAQ states that Green Credits issued for tree
 * plantation are non-tradable and non-transferable except between a holding
 * company and its subsidiary companies. RupayKg therefore may custody and
 * reconcile such credits, but must not expose them as marketplace inventory.
 */
export const GREEN_CREDIT_METHODOLOGIES: GreenCreditMethodology[] = [
  {
    id: "GCP-ECO-RESTORATION-2025",
    name: "Eco-Restoration of Degraded Forest Land under the Green Credit Programme",
    status: "operational",
    administrator: "ICFRE",
    authority: "MoEFCC",
    activity: "Eco-restoration of eligible degraded forest land under the GCP modalities, including plantation and site-specific restoration activities under an approved DPR.",
    creditRule: "Authoritative GCP issuance only; RupayKg records the issued quantity and custody status and does not calculate, mint, or expose Green Credits as tradable marketplace inventory.",
    tradable: false,
    transferable: false,
    eligibility: [
      "Eligible degraded forest land must be under the control and management of the State/UT Forest Department and uploaded to the GCP Portal.",
      "Protected areas such as Wildlife Sanctuaries, National Parks and Tiger Reserves are not eligible under the current FAQ.",
      "Each eligible land parcel must be a compact area of at least 5 hectares and free from encumbrances.",
      "Project activity follows an approved Detailed Project Report and the applicable State Forest Department process.",
      "GCA bears the applicable restoration, verification and maintenance costs."
    ],
    evidence: [
      "GCP project/application reference",
      "GCP land-parcel reference and KML/GIS boundary",
      "DNO/SNO land verification and approval records",
      "Detailed Project Report (DPR)",
      "State Forest Department / GCP MoU",
      "Six-monthly progress reports",
      "Geotagged photographs and restoration evidence",
      "Canopy density, survival/growth and site-condition monitoring",
      "Administrator verification report",
      "Authoritative GCP issuance reference"
    ],
    officialPortal: "https://www.moefcc-gcp.in/"
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
  tradable?: boolean;
  transferable?: boolean;
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
        nextStep: "Complete methodology-specific project documentation and monitoring, obtain applicable ACVA validation/verification, then follow the BEE/ICM issuance process.",
        tradable: true,
        transferable: true
      };
    }

    if (activity.greenCreditMethodologyId === "GCP-ECO-RESTORATION-2025" || activity.greenCreditMethodologyId === "GCP-TREE-PLANTATION-2024") {
      return {
        pathway: "GREEN_CREDIT",
        eligible: true,
        status: "needs_project_review",
        reason: "Routed to the currently operational GCP eco-restoration pathway. RupayKg records evidence and custody status only; it does not issue the Green Credit.",
        methodologyId: "GCP-ECO-RESTORATION-2025",
        authority: "MoEFCC",
        issuer: "ICFRE / Green Credit Programme process",
        nextStep: "Complete the official GCP land, DPR, Forest Department, restoration, monitoring and verification process. After authoritative issuance, custody may be recorded, but the current GCP FAQ does not permit marketplace trading of these Green Credits.",
        tradable: false,
        transferable: false
      };
    }

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
        nextStep: "Open a CCTS project eligibility review and collect the methodology-specific evidence before ACVA engagement.",
        tradable: true,
        transferable: true
      };
    }

    return {
      pathway: "MRV_ONLY",
      eligible: false,
      status: "mrv_only",
      reason: "No currently operational government credit methodology can be defensibly assigned from the supplied activity data.",
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