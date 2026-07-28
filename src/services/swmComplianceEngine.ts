import mongoose from 'mongoose';

// ========================================================
// SWM COMPLIANCE ENGINE & CPCB OPERATIONAL INTEGRATION DATA MODELS
// ========================================================

// 1. SwmCompliance Model
const swmComplianceSchema = new mongoose.Schema({
  entityId: { type: String, required: true },
  entityType: { type: String, required: true }, // BWG, ULB, Facility, Recycler, Transporter, Collector, Producer, Vendor
  ruleId: { type: String, required: true },
  ruleDescription: { type: String },
  status: { type: String, enum: ['Compliant', 'Non-Compliant', 'Review Required', 'Validating'], default: 'Validating' },
  score: { type: Number, default: 100 },
  lastInspectionDate: { type: Date },
  nextInspectionDate: { type: Date },
  violationsCount: { type: Number, default: 0 },
  evidence: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const SwmCompliance = mongoose.models.SwmCompliance || mongoose.model('SwmCompliance', swmComplianceSchema);

// 2. SwmRegistration Model (Layer 1)
const swmRegistrationSchema = new mongoose.Schema({
  registryId: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['BWG', 'ULB', 'Facility', 'Recycler', 'Transporter', 'Collection Agency', 'Producer', 'Vendor'] 
  },
  name: { type: String, required: true },
  gstPanCin: {
    gstin: String,
    pan: String,
    cin: String
  },
  location: {
    state: String,
    district: String,
    ulb: String,
    ward: String,
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  contactPersons: [{
    name: String,
    designation: String,
    phone: String,
    email: String
  }],
  operationalMetrics: {
    builtUpAreaSqm: Number,
    waterConsumptionKlDay: Number,
    dailyWasteGenerationKg: Number,
    wasteCategories: [String] // Wet/Organic, Dry Recyclable, Domestic Hazardous, Sanitary, E-waste, C&D
  },
  licences: [{
    permitType: String, // CTO, CTE, CPCB Authorisation
    permitNumber: String,
    issuedBy: String,
    validUntil: Date,
    status: String
  }],
  status: { type: String, enum: ['Active', 'Pending CPCB Sync', 'Suspended', 'Closed'], default: 'Active' },
  cpcbSyncStatus: { type: String, enum: ['Synced', 'Pending', 'Failed'], default: 'Synced' },
  cpcbToken: { type: String },
  complianceScore: { type: Number, default: 94 },
  issuedAt: { type: Date, default: Date.now },
  validUntil: { type: Date }
});

export const SwmRegistration = mongoose.models.SwmRegistration || mongoose.model('SwmRegistration', swmRegistrationSchema);

// 3. SWM Compliance Service Class
export class SWMComplianceService {
  async registerEntity(data: any) {
    const registryId = `REG-SWM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1); // 1 year validity
    
    const registration = new SwmRegistration({
      registryId,
      cpcbToken: `CPCB-AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      cpcbSyncStatus: 'Synced',
      ...data,
      validUntil
    });
    
    if (mongoose.connection.readyState === 1) {
      await registration.save();
    }
    return registration;
  }

  async validateCompliance(entityId: string, ruleId: string, evidenceData: any) {
    let status = 'Compliant';
    let scoreDelta = 0;
    
    if (!evidenceData || !evidenceData.segregationImages || evidenceData.segregationImages.length < 4) {
       if (ruleId === 'RULE_4_1') { // Segregation at source (4 streams)
         status = 'Non-Compliant';
         scoreDelta = -10;
       }
    }

    if (mongoose.connection.readyState === 1) {
      await SwmCompliance.updateOne(
        { entityId, ruleId } as any,
        { 
          status, 
          ruleDescription: 'Segregation into 4 streams (Wet, Dry, Sanitary, Special Care)',
          $inc: { score: scoreDelta },
          $push: { evidence: evidenceData },
          updatedAt: new Date()
        },
        { upsert: true }
      );
      
      if (scoreDelta !== 0) {
        await SwmRegistration.updateOne(
          { registryId: entityId } as any,
          { $inc: { complianceScore: scoreDelta } }
        );
      }
    }
    
    return { entityId, ruleId, status, scoreDelta };
  }
  
  async getDashboardMetrics(type: string, locationFilter?: any) {
    if (mongoose.connection.readyState === 1) {
      const query = locationFilter || {};
      const totalEntities = await SwmRegistration.countDocuments(query);
      const nonCompliant = await SwmCompliance.countDocuments({ ...query, status: 'Non-Compliant' });
      const avgScoreData = await SwmRegistration.aggregate([
        { $match: query },
        { $group: { _id: null, avgScore: { $avg: '$complianceScore' } } }
      ]);
      
      return {
        totalRegisteredEntities: totalEntities || 0,
        activeViolations: nonCompliant || 0,
        complianceScore: avgScoreData.length > 0 ? Number(avgScoreData[0].avgScore.toFixed(1)) : 100.0
      };
    }

    return {
      totalRegisteredEntities: 0,
      activeViolations: 0,
      complianceScore: 100.0
    };
  }
}

export const swmComplianceService = new SWMComplianceService();
