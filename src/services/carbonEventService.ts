import { db } from '../db/index.ts';
import { carbon_events } from '../db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

export class CarbonEventService {
  static async addCarbonEvent(eventData: any) {
    const id = eventData.id || `ce_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const amount = Number(
      eventData.amount_tco2e ||
      eventData.amountTco2e ||
      (eventData.net_carbon_reduction_kg_co2e ? eventData.net_carbon_reduction_kg_co2e / 1000 : 0) ||
      0
    );

    const mapped = {
      id,
      recordId: eventData.record_id || eventData.recordId || null,
      eventType: eventData.event_type || eventData.eventType || 'GENERATION',
      amountTco2e: amount,
      status: eventData.status || 'RECORDED',
      stakeholderChain: eventData.stakeholder_chain || eventData.stakeholderChain || [],
      methodologyCode: eventData.methodology_code || eventData.methodologyCode || null,
      evidenceHash: eventData.evidence_hash || eventData.evidenceHash || null,
      village: eventData.village || null,
      district: eventData.district || null,
      state: eventData.state || null,
      metadata: eventData.metadata || {
        diversion_estimate_kg_co2e: eventData.diversion_estimate_kg_co2e,
        methane_estimate_kg_co2e: eventData.methane_estimate_kg_co2e,
        net_carbon_reduction_kg_co2e: eventData.net_carbon_reduction_kg_co2e,
        mrv_score: eventData.mrv_score,
        waste_type: eventData.waste_type,
        weight_kg: eventData.weight_kg,
      },
      createdAt: new Date(eventData.createdAt || eventData.created_at || eventData.timestamp || Date.now()),
    };

    try {
      await db.insert(carbon_events).values(mapped).onConflictDoNothing();
    } catch (err) {
      console.warn('DB write warning in CarbonEventService.addCarbonEvent:', err);
    }
    return mapped;
  }

  static async addEvent(eventData: any) {
    return await this.addCarbonEvent(eventData);
  }


  static async getCarbonEvent(id: string) {
    try {
      const result = await db.select().from(carbon_events).where(eq(carbon_events.id, id));
      return result[0] || null;
    } catch (err) {
      console.warn('DB read warning in CarbonEventService.getCarbonEvent:', err);
      return null;
    }
  }

  static async getAllCarbonEvents() {
    try {
      return await db.select().from(carbon_events).orderBy(desc(carbon_events.createdAt));
    } catch (err) {
      console.warn('DB read warning in CarbonEventService.getAllCarbonEvents:', err);
      return [];
    }
  }
}
