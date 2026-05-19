import { WasteEvent } from "../../shared/types/mrv";

export class ReportingService {
  static generateDistrictReport(district: string, records: WasteEvent[]) {
    const districtRecords = records.filter(r => r.governance?.municipal_sign_off?.ward_id === district);
    return {
      district,
      total_tonnage: districtRecords.reduce((acc, r) => acc + r.weight, 0),
      event_count: districtRecords.length,
      average_trust: districtRecords.reduce((acc, r) => acc + r.trust_score, 0) / districtRecords.length || 0,
      timestamp: new Date().toISOString()
    };
  }

  static generateNationalStats(records: WasteEvent[]) {
    return {
      total_events: records.length,
      total_weight_kg: records.reduce((acc, r) => acc + r.weight, 0),
      total_ccc_eligible: records.filter(r => r.status === 'governance_complete').length,
      timestamp: new Date().toISOString()
    };
  }
}
