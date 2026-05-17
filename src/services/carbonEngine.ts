import crypto from "crypto";

// ========================================================
// CARBON CALCULATION ENGINE
// ========================================================

/**
 * Waste Diversion
 * Avoided Emissions = Waste Diverted * Avoided Emission Factor
 */
export function calculateDiversion(wasteKg: number, factor: number = 0.5): number {
  return wasteKg * factor; // kg CO2e
}

/**
 * Landfill Methane Recovery
 * ER = ((FCH4_PJ - FCH4_BL) * GWPCH4 * (1 - OX)) - PE - LE
 * Simplified for MRV
 */
export function calculateLandfillMethane(wasteKg: number, isOrganic: boolean): number {
  if (!isOrganic) return 0;
  // Simplified methane potential
  const fractionDegradable = 0.6;
  const methaneGenerationPotential = 0.5; // kg CH4 per kg degradable
  const gwpCH4 = 28; // Global Warming Potential of Methane
  return wasteKg * fractionDegradable * methaneGenerationPotential * gwpCH4; // kg CO2e avoided
}

/**
 * Net Emission Reduction
 * ER = BE - PE - LE
 */
export function calculateNetReduction(baselineEmissions: number, projectEmissions: number, leakageEmissions: number): number {
  return Math.max(0, baselineEmissions - projectEmissions - leakageEmissions);
}

/**
 * Transport Emissions
 * Emissions = Distance * Fuel * Emission Factor
 */
export function calculateTransportEmissions(distanceKm: number, fuelPerKm: number = 0.1, emissionFactor: number = 2.68): number {
  return distanceKm * fuelPerKm * emissionFactor; // kg CO2e
}

/**
 * Process Biomass Emissions
 * PEBP = electricity + fuel + methane + compost + digestion + wastewater + additives
 */
export function calculateBiomassProcessingEmissions(weightKg: number): number {
  // Rough estimate of 0.05 kg CO2e per kg processed
  return weightKg * 0.05; 
}

/**
 * Anaerobic Digestion
 */
export function calculateAnaerobicDigestion(weightKg: number): { recovery: number, leakage: number, avoided: number } {
  const recovery = weightKg * 0.4 * 28; // methane recovery CO2e
  const leakage = recovery * 0.05; // 5% leakage
  const avoided = weightKg * 1.5; // avoided landfill
  return { recovery, leakage, avoided };
}

/**
 * Carbon Event Generation
 */
export function generateCarbonEvent(record: any, wasteTypeConfig: any) {
  const isOrganic = ['Municipal Organic Waste', 'Food & Kitchen Waste', 'Garden & Leaf Litter', 'Livestock Manure'].includes(record.waste_type) || record.context === 'rural';
  
  const diverted = calculateDiversion(record.weight_kg);
  const methaneAvoided = calculateLandfillMethane(record.weight_kg, isOrganic);
  
  const projectEmissions = calculateTransportEmissions(15); // Average 15km transport
  const processingEmissions = isOrganic ? calculateBiomassProcessingEmissions(record.weight_kg) : 0;
  
  const baselineEmissions = diverted + methaneAvoided;
  const netReduction = calculateNetReduction(baselineEmissions, projectEmissions + processingEmissions, 0);

  return {
    id: "CARB" + crypto.randomBytes(4).toString("hex").toUpperCase(),
    waste_event_id: record.id,
    timestamp: new Date().toISOString(),
    geo_lat: record.geo_lat,
    geo_long: record.geo_long,
    stakeholder_chain: [record.citizen_id],
    emissions_profile: {
      baseline_emissions: baselineEmissions,
      project_emissions: projectEmissions + processingEmissions,
      leakage: 0
    },
    methane_estimate_kg_co2e: methaneAvoided,
    diversion_estimate_kg_co2e: diverted,
    net_carbon_reduction_kg_co2e: netReduction,
    mrv_score: (1 - (record.risk_score || 0)) * 100,
    status: "prepared"
  };
}
