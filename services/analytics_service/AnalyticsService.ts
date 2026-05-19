import { WasteEvent } from "../../shared/types/mrv";

export class AnalyticsService {
  /**
   * Sovereign National Analytics Service
   * In production, this performs OLAP queries on ClickHouse
   */

  static async getNationalCO2Trends(records: any[] = []) {
      if (!records || records.length === 0) {
          return [];
      }
      
      const trends: any[] = [];
      const groupedByMonth = records.reduce((acc: any, r: any) => {
          const date = new Date(r.timestamp);
          const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
          if (!acc[month]) acc[month] = 0;
          acc[month] += (r.carbon_output?.co2e_avoided_kg || 0) / 1000;
          return acc;
      }, {});
      
      Object.entries(groupedByMonth).forEach(([date, co2e]) => {
          trends.push({ date, co2e, growth: 0 }); // Simplification for demo
      });
      
      return trends;
  }

  static async getFraudTrends(records: any[] = []) {
      const fraudRecords = records.filter(r => r.mrv_status === 'rejected' || r.status === 'flagged');
      
      const typeCounts: Record<string, { count: number, district: string }> = {};
      
      fraudRecords.forEach((r: any) => {
          const type = r.mrv_reason || 'Anomaly';
          const district = r.governance?.municipal_sign_off?.ward_id || 'Unknown';
          
          if (!typeCounts[type]) {
              typeCounts[type] = { count: 0, district };
          }
          typeCounts[type].count++;
      });

      return Object.entries(typeCounts).map(([type, data]) => ({
          type,
          count: data.count,
          district: data.district
      }));
  }

  static async getStatePerformance(state: string, records: any[] = []) {
      const stateRecords = records.filter((r: any) => 
          (r.governance?.municipal_sign_off?.ward_id?.toLowerCase().includes(state.toLowerCase()) || '')
      );
      
      const total_tonnage = stateRecords.reduce((sum, r: any) => sum + (r.weight_kg || 0), 0) / 1000;
      const verified_count = stateRecords.filter(r => r.mrv_status === 'verified').length;
      
      return {
          state,
          total_tonnage,
          payout_efficiency: '0%',
          verified_rate: stateRecords.length ? `${Math.round((verified_count / stateRecords.length) * 100)}%` : '0%',
          active_farmers: 0,
          recycler_count: 0
      };
  }
}

