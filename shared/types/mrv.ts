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

export interface CarbonOutput {
  id: string;
  waste_event_id: string;
  methane_avoided_kg: number;
  compost_reduction_kg: number;
  biomass_substitution_kg: number;
  net_co2e_kg: number;
  readiness_score: number;
  methodology: string;
  timestamp: string;
}

export interface ApprovalChain {
  waste_event_id: string;
  field_sign_off: { user_id: string; timestamp: string; hash: string } | null;
  panchayat_sign_off: { user_id: string; name: string; timestamp: string; seal_id: string } | null;
  municipal_sign_off: { user_id: string; name: string; timestamp: string; ward_id: string } | null;
  regulator_sign_off: { user_id: string; timestamp: string; registry_id: string } | null;
  status: 'pending' | 'partially_verified' | 'governance_complete' | 'rejected';
}
