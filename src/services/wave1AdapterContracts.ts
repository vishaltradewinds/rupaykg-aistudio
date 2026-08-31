export type Wave1Methodology = "BM-WA03.001" | "BM-WA03.002" | "BM-WA03.003" | "BM-IN02.002" | "BM-AG04.001";

export interface Wave1CalculationInput {
  methodologyId: Wave1Methodology;
  projectId: string;
  context: "urban" | "rural" | "mixed";
  parameters: Readonly<Record<string, number>>;
  evidenceIds: readonly string[];
}

export interface Wave1CalculationResult {
  methodologyId: Wave1Methodology;
  projectId: string;
  context: Wave1CalculationInput["context"];
  emissionsReductionTco2e: number;
  traceHash: string;
  evidenceIds: readonly string[];
}

export function validateWave1Input(input: Wave1CalculationInput): void {
  if (!input.projectId.trim()) throw new Error("projectId is required");
  if (!input.evidenceIds.length) throw new Error("evidence is required");
  for (const [key, value] of Object.entries(input.parameters)) {
    if (!Number.isFinite(value)) throw new Error(`parameter ${key} must be finite`);
  }
}

/**
 * Shared Wave-1 contract. Methodology adapters implement equations behind this
 * boundary; urban/rural/mixed context never forks the equation implementation.
 */
export const WAVE1_METHODOLOGIES: readonly Wave1Methodology[] = [
  "BM-WA03.001", "BM-WA03.002", "BM-WA03.003", "BM-IN02.002", "BM-AG04.001"
];
