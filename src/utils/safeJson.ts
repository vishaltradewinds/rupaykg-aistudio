/**
 * Helper utilities for safe JSON network fetching and parsing in RupayKg OS.
 * Prevents "Unexpected token '<', '<!doctype ...' is not valid JSON" and "Failed to fetch" crashes.
 */

export async function safeParseJson<T = any>(res: Response): Promise<T | null> {
  try {
    if (!res || !res.ok) return null;
    const contentType = res.headers.get("content-type");
    const text = await res.text();
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

export async function safeFetchJson<T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(input, init);
    return await safeParseJson<T>(res);
  } catch (err) {
    console.warn(`safeFetchJson failed for ${typeof input === 'string' ? input : 'request'}:`, err);
    return null;
  }
}
