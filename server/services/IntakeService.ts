import { AIValidationService } from './AIValidationService';
import { CarbonEngine } from './CarbonEngine';
import { GovernanceService } from './GovernanceService';

export interface WasteEvent {
  id: string;
  source: 'citizen' | 'farmer' | 'municipal' | 'panchayat';
  type: string;
  weight: number;
  geo: { lat: number; lng: number };
  evidence: {
    photo_url: string;
    qr_batch_id?: string;
    vehicle_proof?: string;
  };
  trust_score: number;
  carbon_output: any;
  governance: any;
  status: string;
  timestamp: string;
}

export class IntakeService {
  static async process(data: any, user: any): Promise<WasteEvent> {
    const eventId = `WE-${Date.now()}`;
    
    // 1. AI Validation
    const aiResult = await AIValidationService.validateWasteActivity(
      data.image_url, 
      data.weight_kg, 
      data.waste_type
    );

    // 2. Carbon Computation
    const carbon = CarbonEngine.compute(data.waste_type, data.weight_kg);
    carbon.waste_event_id = eventId;

    // 3. Initialize Governance Chain
    const governance = GovernanceService.createApprovalChain(eventId);

    return {
      id: eventId,
      source: data.context || 'citizen',
      type: data.waste_type,
      weight: data.weight_kg,
      geo: { lat: data.geo_lat, lng: data.geo_long },
      evidence: {
        photo_url: data.image_url,
        qr_batch_id: data.qr_id
      },
      trust_score: aiResult.score,
      carbon_output: carbon,
      governance: governance,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
  }
}
