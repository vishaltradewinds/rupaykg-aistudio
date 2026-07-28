/**
 * RupayKg Circular OS - Local Government Directory (LGD) Services
 * Provides unified, secure, race-condition-safe fetching of LGD hierarchy.
 */

export interface LgdState {
  state_name: string;
  state_lgd_code: number;
}

export interface LgdDistrict {
  district_name: string;
  district_lgd_code: number;
  state_name: string;
}

export interface LgdSubdistrict {
  subdistrict_name: string;
  subdistrict_lgd_code: number;
  district_name: string;
  state_name: string;
}

export interface LgdLocalBody {
  local_body_name: string;
  local_body_lgd_code: number;
  local_body_type: string;
  subdistrict_name: string;
  district_name: string;
  state_name: string;
}

/**
 * Safely fetches LGD data. Checks for response validity, ensures headers indicate JSON,
 * and parses it safely. Implements backoff retries for transient failures and handles
 * AbortSignal to avoid race conditions.
 */
export async function safeFetchLgdJson<T>(url: string, signal?: AbortSignal, retries = 5): Promise<T> {
  let lastError: any = null;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response (likely HTML fallback or proxy message)");
      }
      
      const text = await res.text();
      if (text.trim().startsWith("<")) {
        throw new Error("Received HTML content instead of expected JSON");
      }
      
      return JSON.parse(text) as T;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return [] as any; // Aborted cleanly
      }
      lastError = err;
      if (i < retries - 1) {
        // Exponential backoff capped at 3s
        const delay = Math.min(3000, 500 * (i + 1));
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.warn(`safeFetchLgdJson failed for ${url}:`, lastError);
  return [] as any;
}
