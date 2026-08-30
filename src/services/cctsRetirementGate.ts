export type RetirementAuthority = "ICM_REGISTRY";

export interface RetirementRequest {
  custodyId: string;
  issuer: "BEE";
  registry: RetirementAuthority;
  authoritativeSerial: string;
  quantity: number;
  retirementReference: string;
  retireeAccount: string;
  purpose: "SCOPE_1_OFFSET" | "SCOPE_2_OFFSET" | "OTHER_ELIGIBLE_PURPOSE";
  authoritativeRetirementConfirmed: boolean;
  reconciled: boolean;
  alreadyRetiredQuantity: number;
  availableQuantity: number;
}

export interface RetirementDecision {
  accepted: boolean;
  state: "RETIRED" | "REJECTED";
  retiredQuantity: number;
  reason?: string;
  conservationInvariant: boolean;
}

/**
 * Final CCC retirement boundary.
 *
 * RupayKg records retirement; it does not manufacture an authoritative
 * retirement event. A CCC can only be retired after the authoritative ICM
 * retirement confirmation has been received and reconciled.
 */
export function admitCctsRetirement(request: RetirementRequest): RetirementDecision {
  const invariant =
    Number.isFinite(request.availableQuantity) &&
    Number.isFinite(request.quantity) &&
    request.availableQuantity >= 0 &&
    request.quantity > 0;

  if (!invariant) {
    return {
      accepted: false,
      state: "REJECTED",
      retiredQuantity: 0,
      reason: "Invalid retirement quantity",
      conservationInvariant: false,
    };
  }

  if (request.issuer !== "BEE" || request.registry !== "ICM_REGISTRY") {
    return {
      accepted: false,
      state: "REJECTED",
      retiredQuantity: 0,
      reason: "CCC retirement requires BEE/ICM provenance",
      conservationInvariant: true,
    };
  }

  if (!request.authoritativeSerial || !request.retirementReference || !request.retireeAccount) {
    return {
      accepted: false,
      state: "REJECTED",
      retiredQuantity: 0,
      reason: "Authoritative serial, retirement reference and retiree account are required",
      conservationInvariant: true,
    };
  }

  if (!request.authoritativeRetirementConfirmed || !request.reconciled) {
    return {
      accepted: false,
      state: "REJECTED",
      retiredQuantity: 0,
      reason: "Authoritative ICM retirement confirmation and reconciliation are required",
      conservationInvariant: true,
    };
  }

  if (request.quantity > request.availableQuantity) {
    return {
      accepted: false,
      state: "REJECTED",
      retiredQuantity: 0,
      reason: "Retirement exceeds available custody quantity",
      conservationInvariant: true,
    };
  }

  const retiredQuantity = request.quantity;
  const conservationInvariant = retiredQuantity <= request.availableQuantity;

  return {
    accepted: conservationInvariant,
    state: conservationInvariant ? "RETIRED" : "REJECTED",
    retiredQuantity: conservationInvariant ? retiredQuantity : 0,
    conservationInvariant,
  };
}
