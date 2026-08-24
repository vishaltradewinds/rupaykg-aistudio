const fs = require('fs');
let code = fs.readFileSync('src/services/carbonEngine.ts', 'utf8');

const cqePatch = `export class CQEBaselineEngine {
  public static calculateBaseline(
    activity: CQEActivityData,
    characterisation: CQEMaterialCharacterisation,
    methodology: CQEMethodologyDefinition
  ): { baselineEmissionsTco2e: number; breakdown: Record<string, number>; status?: string; reason?: string } {
    const weightTonnes = activity.netMaterialKg / 1000.0;
    let beTco2e = 0;
    const breakdown: Record<string, number> = {};

    // Do NOT fabricate baseline if methodology requires monitoring we don't have
    if (!activity.monitoringInputs || Object.keys(activity.monitoringInputs).length === 0) {
      return { 
        baselineEmissionsTco2e: 0, 
        breakdown: { estimated_potential: weightTonnes * 1.5 },
        status: 'CALCULATION_BLOCKED',
        reason: 'Missing required monitored parameters (e.g. gas flow meter data, energy output)'
      };
    }

    switch (methodology.methodologyCode) {
      case "BM WA03.001": {
        // Landfill Methane Recovery requires monitored gas volumes
        if (!activity.monitoringInputs.ch4RecoveredTonnes) {
            return {
                baselineEmissionsTco2e: 0, 
                breakdown: {},
                status: 'CALCULATION_BLOCKED',
                reason: 'Missing monitored ch4RecoveredTonnes'
            };
        }
        const gwpCH4 = 28.0;
        const ox = 0.10;
        beTco2e = activity.monitoringInputs.ch4RecoveredTonnes * gwpCH4 * (1 - ox);
        breakdown.landfillMethaneAvoided = Number(beTco2e.toFixed(4));
        break;
      }
      case "BM WA03.002": {
        // Composting FOD avoidance
        const doc_j = characterisation.degradableOrganicCarbon || 0.15;
        const doc_f = 0.5; // fraction of DOC dissimilated
        const f = 0.5; // fraction of CH4 in landfill gas
        const mcf = 0.40; // unmanaged shallow dumpsite
        const gwpCH4 = 28.0;
        const ox = 0.10;
        const ch4Produced = weightTonnes * doc_j * doc_f * f * (16 / 12) * mcf;
        beTco2e = ch4Produced * gwpCH4 * (1 - ox);
        breakdown.fodDumpsiteMethaneAvoidance = Number(beTco2e.toFixed(4));
        break;
      }
      case "BM AG04.002": {
        // Crop residue in-situ burning avoidance
        const efBurning = 1.45; // tCO2e per tonne crop residue
        beTco2e = weightTonnes * efBurning;
        breakdown.avoidedOpenFieldCombustion = Number(beTco2e.toFixed(4));
        break;
      }
    }
    return { baselineEmissionsTco2e: Number(beTco2e.toFixed(4)), breakdown, status: 'CALCULATED' };
  }`;

code = code.replace(/export class CQEBaselineEngine \{[\s\S]*?public static calculateBaseline\([\s\S]*?\)\: \{ baselineEmissionsTco2e\: number\; breakdown\: Record<string\, number> \} \{[\s\S]*?return \{ baselineEmissionsTco2e\: Number\(beTco2e\.toFixed\(4\)\)\, breakdown \};\n  \}/, cqePatch);

fs.writeFileSync('src/services/carbonEngine.ts', code);
console.log("Patched Carbon Engine (calculateBaseline)");
