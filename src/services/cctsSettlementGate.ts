/**
 * CCTS settlement gate.
 *
 * RupayKg may calculate and allocate commercial settlement proceeds, but it
 * must never represent its internal settlement as an ICM Registry transfer.
 * Settlement is permitted only after authoritative transfer reconciliation.
 */

export const CCTS_SETTLEMENT_WATERFALL = [
  { code: "PAYMENT_RAILS", label: "Payment & Settlement Rails", percent: 1.0 },
  { code: "CCTS_COMPLIANCE", label: "CCTS / Registry Compliance Levy", percent: 1.5 },
  { code: "ACVA_VVB_RESERVE", label: "ACVA & VVB Audit Assurance Reserve", percent: 2.5 },
  { code: "PROJECT_OWNER", label: "Project Owner", percent: 35.0 },
  { code: "COMMUNITY_AGGREGATOR", label: "Community & Aggregator Dividend", percent: 5.0 },
  { code: "GREEN_BOND_FINANCIER", label: "Green Bond Financier Return", percent: 2.0 },
  { code: "RUPAYKG_TREASURY", label: "RupayKg Treasury & Operating Reserve", percent: 53.0 },
] as const;

export type SettlementGateInput = {
  reservationStatus: "RESERVED" | "CANCELLED" | "EXPIRED";
  authoritativeTransferStatus: "CONFIRMED" | "PENDING" | "REJECTED";
  reconciliationStatus: "RECONCILED" | "PENDING" | "FAILED";
  tradeValue: number;
  currency: string;
};

export type SettlementAllocation = {
  code: string;
  label: string;
  percent: number;
  amount: number;
};

export type SettlementGateResult = {
  eligible: boolean;
  reason?: string;
  allocations: SettlementAllocation[];
  totalAllocated: number;
};

const WATERFALL_TOTAL = CCTS_SETTLEMENT_WATERFALL.reduce(
  (sum, item) => sum + item.percent,
  0,
);

export function evaluateCctsSettlement(
  input: SettlementGateInput,
): SettlementGateResult {
  if (input.reservationStatus !== "RESERVED") {
    return { eligible: false, reason: "SETTLEMENT_REQUIRES_ACTIVE_RESERVATION", allocations: [], totalAllocated: 0 };
  }
  if (input.authoritativeTransferStatus !== "CONFIRMED") {
    return { eligible: false, reason: "AUTHORITATIVE_TRANSFER_NOT_CONFIRMED", allocations: [], totalAllocated: 0 };
  }
  if (input.reconciliationStatus !== "RECONCILED") {
    return { eligible: false, reason: "CUSTODY_RECONCILIATION_NOT_COMPLETE", allocations: [], totalAllocated: 0 };
  }
  if (!Number.isFinite(input.tradeValue) || input.tradeValue <= 0) {
    return { eligible: false, reason: "INVALID_TRADE_VALUE", allocations: [], totalAllocated: 0 };
  }
  if (!input.currency.trim()) {
    return { eligible: false, reason: "CURRENCY_REQUIRED", allocations: [], totalAllocated: 0 };
  }
  if (Math.abs(WATERFALL_TOTAL - 100) > Number.EPSILON) {
    return { eligible: false, reason: "WATERFALL_TOTAL_MUST_EQUAL_100_PERCENT", allocations: [], totalAllocated: 0 };
  }

  const allocations = CCTS_SETTLEMENT_WATERFALL.map((item) => ({
    ...item,
    amount: Number(((input.tradeValue * item.percent) / 100).toFixed(2)),
  }));

  const totalAllocated = Number(
    allocations.reduce((sum, item) => sum + item.amount, 0).toFixed(2),
  );

  // Currency rounding may leave a one-cent residual. Keep settlement atomic by
  // assigning any residual to the treasury bucket rather than creating value.
  const residual = Number((input.tradeValue - totalAllocated).toFixed(2));
  if (residual !== 0) {
    const treasury = allocations.find((item) => item.code === "RUPAYKG_TREASURY");
    if (!treasury) {
      return { eligible: false, reason: "TREASURY_BUCKET_MISSING", allocations: [], totalAllocated: 0 };
    }
    treasury.amount = Number((treasury.amount + residual).toFixed(2));
  }

  return {
    eligible: true,
    allocations,
    totalAllocated: input.tradeValue,
  };
}
