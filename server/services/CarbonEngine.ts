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

export class CarbonEngine {
  // Constants per IPCC / UNFCCC Tier 1/2 approximations
  private static METHANE_FACTOR = 0.05; // 50kg CH4 per ton of organic waste in landfill
  private static GWP_CH4 = 28; // Global Warming Potential of Methane
  private static FOSSIL_SUBSTITUTION_FACTOR = 0.8; // 0.8kg CO2e reduced per kg biomass used as fuel

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
      compost_reduction_kg: weightKg * 0.2, // Approx 20% compost recovery
      biomass_substitution_kg: biomassSubstitution,
      net_co2e_kg: netCo2e,
      readiness_score: readinessScore,
      methodology: 'ISO-14064-2:2019 / UNFCCC ACM0001',
      timestamp: new Date().toISOString()
    };
  }
}
