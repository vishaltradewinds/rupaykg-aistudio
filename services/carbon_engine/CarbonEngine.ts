import { CarbonOutput } from "../../shared/types/mrv";

export class CarbonEngine {
  private static METHANE_FACTOR = 0.05; 
  private static GWP_CH4 = 28; 
  private static FOSSIL_SUBSTITUTION_FACTOR = 0.8;

  static compute(wasteType: string, weightKg: number): CarbonOutput {
    let methaneAvoided = 0;
    let biomassSubstitution = 0;
    let readinessScore = 90;

    if (wasteType === 'organic' || wasteType === 'biomass') {
      methaneAvoided = (weightKg / 1000) * this.METHANE_FACTOR * this.GWP_CH4 * 1000;
    }

    if (wasteType === 'fuel_ready' || wasteType === 'briquette') {
      biomassSubstitution = weightKg * this.FOSSIL_SUBSTITUTION_FACTOR;
    }

    const netCo2e = methaneAvoided + biomassSubstitution;

    return {
      id: `CO2-${Date.now()}`,
      waste_event_id: '',
      methane_avoided_kg: methaneAvoided,
      compost_reduction_kg: weightKg * 0.2,
      biomass_substitution_kg: biomassSubstitution,
      net_co2e_kg: netCo2e,
      readiness_score: readinessScore,
      methodology: 'ISO-14064-2:2019 / UNFCCC ACM0001',
      timestamp: new Date().toISOString()
    };
  }
}
