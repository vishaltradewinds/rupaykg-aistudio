import { db } from '../db/index.ts';
import { farmers } from '../db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

export class FarmerService {
  static formatFarmer(f: any) {
    if (!f) return null;
    const meta = (typeof f.metadata === 'object' && f.metadata !== null) ? f.metadata : {};
    return {
      ...f,
      geo_lat: meta.geo_lat || f.geo_lat || null,
      geo_long: meta.geo_long || f.geo_long || null,
      crop_type: f.primaryCrop || meta.crop_type || 'Paddy Straw',
      land_area: f.landAreaAcres || meta.land_area || 0,
      aadhaar_hash: f.aadhaarHash || meta.aadhaar_hash || null,
      bank_account: f.bankAccount || meta.bank_account || null,
      shg_id: f.shgId || meta.shg_id || null,
      fpo_id: f.fpoId || meta.fpo_id || null,
    };
  }

  static async addFarmer(farmerData: any) {
    const id = farmerData.id || `farmer_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const meta = {
      ...(typeof farmerData.metadata === 'object' ? farmerData.metadata : {}),
      geo_lat: farmerData.geo_lat || null,
      geo_long: farmerData.geo_long || null,
      crop_type: farmerData.crop_type || farmerData.primaryCrop || null,
      land_area: farmerData.land_area || farmerData.landAreaAcres || 0,
    };

    const mapped = {
      id,
      name: farmerData.name || 'Unnamed Farmer',
      phone: farmerData.phone || null,
      aadhaarHash: farmerData.aadhaar_hash || farmerData.aadhaarHash || null,
      village: farmerData.village || null,
      subdistrict: farmerData.subdistrict || null,
      district: farmerData.district || null,
      state: farmerData.state || null,
      landAreaAcres: Number(farmerData.land_area_acres || farmerData.land_area || farmerData.landAreaAcres || 0),
      primaryCrop: farmerData.primary_crop || farmerData.crop_type || farmerData.primaryCrop || null,
      bankAccount: farmerData.bank_account || farmerData.bankAccount || null,
      ifsc: farmerData.ifsc || null,
      shgId: farmerData.shg_id || farmerData.shgId || null,
      fpoId: farmerData.fpo_id || farmerData.fpoId || null,
      createdBy: farmerData.created_by || farmerData.createdBy || null,
      metadata: meta,
      createdAt: new Date(farmerData.createdAt || farmerData.created_at || Date.now()),
      updatedAt: new Date(farmerData.updatedAt || farmerData.updated_at || Date.now()),
    };

    try {
      await db.insert(farmers).values(mapped).onConflictDoNothing();
    } catch (err) {
      console.warn('DB write warning in FarmerService.addFarmer:', err);
    }
    return this.formatFarmer(mapped);
  }

  static async getFarmer(id: string) {
    try {
      const result = await db.select().from(farmers).where(eq(farmers.id, id));
      return result[0] ? this.formatFarmer(result[0]) : null;
    } catch (err) {
      console.warn('DB read warning in FarmerService.getFarmer:', err);
      return null;
    }
  }

  static async getAllFarmers() {
    try {
      const rows = await db.select().from(farmers).orderBy(desc(farmers.createdAt));
      return rows.map(r => this.formatFarmer(r));
    } catch (err) {
      console.warn('DB read warning in FarmerService.getAllFarmers:', err);
      return [];
    }
  }

  static async updateFarmer(id: string, updates: any) {
    try {
      await db.update(farmers).set({
        ...updates,
        updatedAt: new Date(),
      }).where(eq(farmers.id, id));
      return await this.getFarmer(id);
    } catch (err) {
      console.warn('DB update warning in FarmerService.updateFarmer:', err);
      return null;
    }
  }

  static async deleteFarmer(id: string) {
    try {
      await db.delete(farmers).where(eq(farmers.id, id));
      return true;
    } catch (err) {
      console.warn('DB delete warning in FarmerService.deleteFarmer:', err);
      return false;
    }
  }
}

