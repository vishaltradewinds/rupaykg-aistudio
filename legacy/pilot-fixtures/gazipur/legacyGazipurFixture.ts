// Legacy Gazipur Test Fixture — Preserved for regression isolation testing
// MUST NOT be imported into active production Jabalpur project code

export const LEGACY_GAZIPUR_FIXTURE = {
  projectId: "RKG-PILOT-GAZIPUR-01",
  siteName: "Gazipur Landfill Methane Recovery Pilot",
  location: "Gazipur, Municipal Corporation of Delhi (MCD), India",
  methodology: "BM WA03.001",
  operator: "Municipal Corporation of Delhi (MCD)",
  inputs: {
    F_CH4_PJ_y: 1000,
    F_CH4_BL_y: 150,
    PE_y: 14,
    LE_y: 0
  },
  legacyResultTco2e: 21406
};

export function validateGazipurDataIsolation(incomingProjectId: string): boolean {
  if (incomingProjectId.toLowerCase().includes("gazipur") || incomingProjectId === "RKG-PILOT-GAZIPUR-01") {
    throw new Error("CONTAMINATION ERROR: Gazipur legacy fixture data cannot be used in active Jabalpur Carbon OS project.");
  }
  return true;
}
