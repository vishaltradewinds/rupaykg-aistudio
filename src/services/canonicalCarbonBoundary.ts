export interface CanonicalCarbonQuantifyRequest {
  activityData: Record<string, unknown>;
}

export interface CanonicalCarbonQuantifyResponse {
  trace: Record<string, unknown>;
}

/**
 * Browser-to-server boundary for carbon quantification.
 * The browser does not perform authoritative carbon calculations.
 */
export const canonicalCarbonBoundary = {
  async quantify(request: CanonicalCarbonQuantifyRequest): Promise<CanonicalCarbonQuantifyResponse> {
    const response = await fetch('/api/carbon/cqe/quantify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Canonical carbon quantification failed (${response.status})`);
    }

    return response.json();
  },

  async getMethodologies(): Promise<unknown> {
    const response = await fetch('/api/carbon/cqe/methodologies');
    if (!response.ok) {
      throw new Error(`Canonical methodology lookup failed (${response.status})`);
    }
    return response.json();
  },
};
