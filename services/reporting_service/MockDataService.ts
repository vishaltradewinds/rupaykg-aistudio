import { WasteEvent } from "../../shared/types/mrv";

export class MockDataService {
  static getMockNationalAnalytics() {
    return [
      { state: 'Maharashtra', tonnage: 1240 },
      { state: 'Punjab', tonnage: 890 },
      { state: 'Gujarat', tonnage: 1100 },
      { state: 'Karnataka', tonnage: 950 },
      { state: 'Haryana', tonnage: 760 },
      { state: 'Tamil Nadu', tonnage: 1050 }
    ];
  }

  static getFraudAlerts() {
    return [
      { id: 'F1', type: 'Image Recycled', district: 'Jabalpur', severity: 'high' },
      { id: 'F2', type: 'GPS Anomaly', district: 'Indore', severity: 'medium' },
      { id: 'F3', type: 'Weight Impossible', district: 'Bhopal', severity: 'critical' }
    ];
  }
}
