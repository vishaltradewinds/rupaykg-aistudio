import { db } from '../db/index.ts';
import { pilot_records, pilot_onboardings } from '../db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

export class PilotService {
  static formatOnboarding(o: any) {
    if (!o) return null;
    const base = (typeof o.baselineData === 'object' && o.baselineData !== null) ? o.baselineData : {};
    return {
      id: o.id,
      name: o.pilotName || base.name || 'Unnamed',
      pilotName: o.pilotName,
      pilotType: o.pilotType,
      phone: base.phone || o.phone || null,
      role: base.role || o.role || 'pilot_participant',
      location: o.location,
      operatorEntityId: o.operatorEntityId,
      status: o.status,
      onboardingDate: o.onboardingDate,
      baselineData: o.baselineData,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };
  }

  static async addPilotOnboarding(data: any) {
    const id = data.id || `pilot_onb_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const base = {
      ...(typeof data.baselineData === 'object' ? data.baselineData : {}),
      phone: data.phone || null,
      role: data.role || 'pilot_participant',
      name: data.name || data.pilot_name || data.pilotName || null,
    };

    const mapped = {
      id,
      pilotName: data.pilot_name || data.pilotName || data.name || 'Unnamed Pilot',
      pilotType: data.pilot_type || data.pilotType || 'URBAN_ULB',
      location: data.location || {},
      operatorEntityId: data.operator_entity_id || data.operatorEntityId || null,
      status: data.status || 'ACTIVE',
      onboardingDate: new Date(data.onboarding_date || data.onboardingDate || Date.now()),
      baselineData: base,
      createdAt: new Date(data.createdAt || data.created_at || Date.now()),
      updatedAt: new Date(data.updatedAt || data.updated_at || Date.now()),
    };

    try {
      await db.insert(pilot_onboardings).values(mapped).onConflictDoNothing();
    } catch (err) {
      console.warn('DB write warning in PilotService.addPilotOnboarding:', err);
    }
    return this.formatOnboarding(mapped);
  }

  static async getPilotOnboardings() {
    try {
      const rows = await db.select().from(pilot_onboardings).orderBy(desc(pilot_onboardings.createdAt));
      return rows.map(r => this.formatOnboarding(r));
    } catch (err) {
      console.warn('DB read warning in PilotService.getPilotOnboardings:', err);
      return [];
    }
  }


  static async addPilotRecord(data: any) {
    const id = data.id || `pilot_rec_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const mapped = {
      id,
      pilotId: data.pilot_id || data.pilotId || 'default_pilot',
      facilityId: data.facility_id || data.facilityId || null,
      materialType: data.material_type || data.materialType || 'ORGANIC',
      weightKg: Number(data.weight_kg || data.weightKg || 0),
      weighbridgeTicket: data.weighbridge_ticket || data.weighbridgeTicket || null,
      gpsCoordinates: data.gps_coordinates || data.gpsCoordinates || {},
      status: data.status || 'RECORDED',
      metadata: data.metadata || {},
      createdAt: new Date(data.createdAt || data.created_at || Date.now()),
    };

    try {
      await db.insert(pilot_records).values(mapped).onConflictDoNothing();
    } catch (err) {
      console.warn('DB write warning in PilotService.addPilotRecord:', err);
    }
    return mapped;
  }

  static async getPilotRecords(pilotId?: string) {
    try {
      if (pilotId) {
        return await db.select().from(pilot_records).where(eq(pilot_records.pilotId, pilotId)).orderBy(desc(pilot_records.createdAt));
      }
      return await db.select().from(pilot_records).orderBy(desc(pilot_records.createdAt));
    } catch (err) {
      console.warn('DB read warning in PilotService.getPilotRecords:', err);
      return [];
    }
  }

  // Alias methods for uniform controller access
  static async addOnboarding(data: any) {
    return await this.addPilotOnboarding(data);
  }

  static async getAllOnboardings() {
    return await this.getPilotOnboardings();
  }

  static async addRecord(data: any) {
    return await this.addPilotRecord({
      ...data,
      material_type: data.wasteType || data.material_type || 'ORGANIC',
      weight_kg: data.weight || data.weight_kg || 0,
      metadata: {
        location: data.location,
        collectorId: data.collectorId,
        estimatedCCC: data.estimatedCCC,
        source: data.source,
        timestamp: data.timestamp,
        ...(typeof data.metadata === 'object' ? data.metadata : {}),
      },
    });
  }

  static async getAllRecords() {
    return await this.getPilotRecords();
  }

  static async getRecordsByCollector(collectorId: string) {
    const all = await this.getPilotRecords();
    return all.filter((r: any) => (r.metadata as any)?.collectorId === collectorId || r.operatorEntityId === collectorId);
  }

  static async validateRecord(id: string, score: number, explanation: string) {
    try {
      const records = await this.getPilotRecords();
      const target = records.find(r => r.id === id);
      if (!target) return null;
      const meta = (typeof target.metadata === 'object' && target.metadata !== null) ? target.metadata : {};
      const updatedMeta = {
        ...meta,
        validationScore: score,
        validationExplanation: explanation,
        validatedAt: new Date().toISOString(),
      };
      await db.update(pilot_records).set({
        status: score >= 0.7 ? 'VALIDATED' : 'FLAGGED',
        metadata: updatedMeta,
      }).where(eq(pilot_records.id, id));
      return { id, score, explanation, status: score >= 0.7 ? 'VALIDATED' : 'FLAGGED' };
    } catch (err) {
      console.warn('DB update warning in PilotService.validateRecord:', err);
      return null;
    }
  }
}

