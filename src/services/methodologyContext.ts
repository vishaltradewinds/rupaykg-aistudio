export type MethodologyContext = "urban" | "rural" | "mixed";

export interface EvidenceRef {
  id: string;
  type: "meter" | "weighbridge" | "lab" | "farm" | "facility" | "document" | "other";
  sourceHash: string;
}

export interface MethodologyProjectContext {
  context: MethodologyContext;
  projectId: string;
  evidence: readonly EvidenceRef[];
}

/**
 * Shared context boundary for all RupayKg methodology adapters.
 * Context changes evidence/monitoring lineage, never the underlying BEE equation.
 */
export function assertMethodologyContext(context: MethodologyProjectContext): void {
  if (!context.projectId.trim()) throw new Error("Methodology context: projectId is required.");
  if (!context.evidence.length) throw new Error("Methodology context: at least one evidence reference is required.");
  for (const evidence of context.evidence) {
    if (!evidence.id.trim() || !evidence.sourceHash.trim()) {
      throw new Error("Methodology context: evidence id and sourceHash are required.");
    }
  }
}
