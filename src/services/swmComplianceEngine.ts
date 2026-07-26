import mongoose from 'mongoose';

// SWM Compliance Models
const swmComplianceSchema = new mongoose.Schema({
  entityId: { type: String, required: true },
  entityType: { type: String, required: true }, // BWG, MRF, Vehicle, Collector, Landfill, LocalBody
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

const swmRegistrationSchema = new mongoose.Schema({
  registryId: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // WasteGenerator, BWG, Facility, Vehicle, Collector, Recycler
  name: { type: String, required: true },
  location: {
    state: String,
    district: String,
    ulb: String,
    ward: String,
    coordinates: { lat: Number, lng: Number }
  },
  contactDetails: {
    email: String,
    phone: String,
    address: String
  },
  status: { type: String, enum: ['Active', 'Pending', 'Suspended', 'Closed'], default: 'Pending' },
  digitalCertificate: { type: String },
  complianceScore: { type: Number, default: 100 },
  issuedAt: { type: Date, default: Date.now },
  validUntil: { type: Date }
});

export const SwmRegistration = mongoose.models.SwmRegistration || mongoose.model('SwmRegistration', swmRegistrationSchema);

export class SWMComplianceService {
  async registerEntity(data: any) {
    const registryId = `REG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1); // 1 year validity
    
    const registration = new SwmRegistration({
      registryId,
      ...data,
      validUntil
    });
    
    await registration.save();
    return registration;
  }

  async validateCompliance(entityId: string, ruleId: string, evidenceData: any) {
    // Basic AI/rule validation stub
    let status = 'Compliant';
    let scoreDelta = 0;
    
    if (!evidenceData || !evidenceData.segregationImages || evidenceData.segregationImages.length < 4) {
       if (ruleId === 'RULE_4_1') { // Segregation at source (4 streams)
         status = 'Non-Compliant';
         scoreDelta = -10;
       }
    }

    const complianceRecord = await SwmCompliance.updateOne(
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
    
    // Update overall entity compliance score
    if (scoreDelta !== 0) {
      await SwmRegistration.updateOne(
        { registryId: entityId } as any,
        { $inc: { complianceScore: scoreDelta } }
      );
    }
    
    return complianceRecord;
  }
  
  async getDashboardMetrics(type: string, locationFilter?: any) {
    const query = locationFilter || {};
    const totalEntities = await SwmRegistration.countDocuments(query);
    const nonCompliant = await SwmCompliance.countDocuments({ ...query, status: 'Non-Compliant' });
    const avgScoreData = await SwmRegistration.aggregate([
      { $match: query },
      { $group: { _id: null, avgScore: { $avg: '$complianceScore' } } }
    ]);
    
    return {
      totalRegisteredEntities: totalEntities,
      activeViolations: nonCompliant,
      complianceScore: avgScoreData.length > 0 ? avgScoreData[0].avgScore : 100
    };
  }
}
