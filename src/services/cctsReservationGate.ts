export type ReservationRequest = {
  custodyStatus: "CUSTODY_ACTIVE";
  availableQuantity: number;
  requestedQuantity: number;
  sellerId: string;
  buyerId: string;
  listingId: string;
  reservationId: string;
};

export type ReservationDecision = {
  accepted: boolean;
  reason?: string;
  reservedQuantity: number;
  remainingAvailableQuantity: number;
  escrowRequired: boolean;
};

/**
 * Domain gate for the reservation boundary.
 *
 * Persistence must execute the accepted mutation in one database transaction
 * with a row lock on the authoritative custody position. This pure gate keeps
 * the safety rules explicit and testable; it does not claim that an internal
 * reservation is an ICM transfer.
 */
export function evaluateCctsReservation(input: ReservationRequest): ReservationDecision {
  if (input.custodyStatus !== "CUSTODY_ACTIVE") {
    return { accepted: false, reason: "CUSTODY_NOT_ACTIVE", reservedQuantity: 0, remainingAvailableQuantity: input.availableQuantity, escrowRequired: false };
  }
  if (!input.sellerId || !input.buyerId || !input.listingId || !input.reservationId) {
    return { accepted: false, reason: "RESERVATION_IDENTIFIERS_REQUIRED", reservedQuantity: 0, remainingAvailableQuantity: input.availableQuantity, escrowRequired: false };
  }
  if (!Number.isFinite(input.requestedQuantity) || input.requestedQuantity <= 0) {
    return { accepted: false, reason: "INVALID_QUANTITY", reservedQuantity: 0, remainingAvailableQuantity: input.availableQuantity, escrowRequired: false };
  }
  if (!Number.isFinite(input.availableQuantity) || input.availableQuantity < input.requestedQuantity) {
    return { accepted: false, reason: "INSUFFICIENT_AVAILABLE_QUANTITY", reservedQuantity: 0, remainingAvailableQuantity: input.availableQuantity, escrowRequired: false };
  }

  return {
    accepted: true,
    reservedQuantity: input.requestedQuantity,
    remainingAvailableQuantity: input.availableQuantity - input.requestedQuantity,
    escrowRequired: true,
  };
}

export const CCTS_RESERVATION_RULES = Object.freeze({
  reservationRequiresActiveCustody: true,
  reservationRequiresPositiveQuantity: true,
  reservationCannotExceedAvailableQuantity: true,
  reservationRequiresEscrowBeforeSettlement: true,
  reservationIsNotAuthoritativeIcmTransfer: true,
  duplicateReservationMustBeIdempotent: true,
});
