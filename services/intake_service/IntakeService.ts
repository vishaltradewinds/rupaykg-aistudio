import { AIValidationService } from '../ai_validation_service/AIValidationService';
import { CarbonEngine } from '../carbon_engine/CarbonEngine';
import { GovernanceService } from '../governance_service/GovernanceService';
import { GeoService } from '../geo_service/GeoService';
import { WorkflowService } from '../workflow_service/WorkflowService';
import { WasteEvent } from '../../shared/types/mrv';

export class IntakeService {
  static async process(data: any, user: any): Promise<WasteEvent> {
    const eventId = `WE-${Date.now()}`;
    
    const workflow = await WorkflowService.initiateWasteWorkflow(eventId, data.context || 'citizen');

    // Geo Fraud Detection (Stage 7)
    const isMockFraud = await GeoService.detectGeoFraud(data.geo_lat, data.geo_long, data.user_lat || data.geo_lat, data.user_long || data.geo_long);

    const aiResult = await AIValidationService.validateWasteActivity(
      data.image_url, 
      data.weight_kg, 
      data.waste_type
    );

    if (isMockFraud) {
        aiResult.score -= 30;
        aiResult.explanation += " [GEO-ANOMALY]: Upload location far from registered node.";
    }

    const carbon = CarbonEngine.compute(data.waste_type, data.weight_kg);
    carbon.waste_event_id = eventId;

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
