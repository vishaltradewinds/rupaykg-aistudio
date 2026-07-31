/**
 * Helper utilities for safe JSON network fetching and parsing in RupayKg OS.
 * Prevents "Unexpected token '<', '<!doctype ...' is not valid JSON" and "Failed to fetch" crashes.
 */

export async function safeParseJson<T = any>(res: Response): Promise<T | null> {
  try {
    if (!res) return null;
    const contentType = res.headers.get("content-type");
    const text = await res.clone().text();
    if (!text) return null;
    const trimmed = text.trim();
    if (trimmed.startsWith("<")) return null;
    if (contentType && !contentType.includes("application/json") && !trimmed.startsWith("{") && !trimmed.startsWith("[")) {
      return null;
    }
    return JSON.parse(text) as T;
  } catch (err) {
    console.warn("safeParseJson failed to parse JSON:", err);
    return null;
  }
}

export async function safeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response | null> {
  try {
    return await fetch(input, init);
  } catch (err) {
    console.warn(`safeFetch failed for ${typeof input === 'string' ? input : 'request'}:`, err);
    return null;
  }
}

export async function safeFetchJson<T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T | null> {
  try {
    const res = await safeFetch(input, init);
    if (!res) return null;
    return await safeParseJson<T>(res);
  } catch (err) {
    console.warn(`safeFetchJson failed for ${typeof input === 'string' ? input : 'request'}:`, err);
    return null;
  }
}
