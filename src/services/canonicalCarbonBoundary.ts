/**
 * Canonical Carbon OS boundary for browser/UI consumers.
 *
 * The UI must talk to the server-backed CQE endpoints through this boundary
 * rather than importing database-backed engines or legacy in-memory MRV state.
 *
 * This is intentionally transport-only: calculation authority remains in the
 * server-side CQE (`/api/carbon/cqe/*`).
 */

export interface CanonicalCarbonQuantifyRequest {
  activityData: Record<string, unknown>;
  customAssay?: Record<string, unknown>;
  scenarioPriceInr?: number;
  pricingType?: string;
}

export interface CanonicalCarbonQuantifyResponse {
  success: boolean;
  trace: Record<string, unknown>;
  message?: string;
}

export interface CanonicalMethodologyRecord {
  methodologyCode?: string;
  version?: string;
  title?: string;
  status?: string;
  [key: string]: unknown;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof payload?.error === 'string'
        ? payload.error
        : `Canonical Carbon OS request failed (${response.status})`;
    throw new Error(message);
  }

  return payload as T;
}

export const canonicalCarbonBoundary = {
  async quantify(
    requestPayload: CanonicalCarbonQuantifyRequest,
  ): Promise<CanonicalCarbonQuantifyResponse> {
    return request<CanonicalCarbonQuantifyResponse>('/api/carbon/cqe/quantify', {
      method: 'POST',
      body: JSON.stringify(requestPayload),
    });
  },

  async getMethodologies(): Promise<CanonicalMethodologyRecord[]> {
    const response = await request<{ methodologies?: CanonicalMethodologyRecord[] }>(
      '/api/carbon/cqe/methodologies',
    );
    return Array.isArray(response.methodologies) ? response.methodologies : [];
  },
};
