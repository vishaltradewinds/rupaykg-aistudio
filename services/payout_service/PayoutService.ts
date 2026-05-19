import { WasteEvent } from "../../shared/types/mrv";

export class PayoutService {
  private static RATE_PER_KG = 2.5; // Rupee per KG for biomass

  static calculatePayout(event: WasteEvent) {
    if (event.status !== 'governance_complete') return 0;
    return event.weight * this.RATE_PER_KG;
  }

  static async disburse(eventId: string, amount: number, userId: string) {
    // Integration point for DPI Payment Rails (UPI/Aadhaar Pay)
    console.log(`[PAYOUT] Disbursing ₹${amount} for event ${eventId} to user ${userId}`);
    return {
      transaction_id: `TXN-${Date.now()}`,
      status: 'success',
      amount
    };
  }
}
