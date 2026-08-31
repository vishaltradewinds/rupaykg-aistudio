/**
 * Compatibility adapter for the frontend LGD fetch contract.
 * LGD data itself is served by the canonical server-side lgdDb boundary.
 * This module contains no LGD data or authority logic.
 */
export async function safeFetchLgdJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  if (text.trim().startsWith('<')) {
    throw new Error('Received HTML content instead of expected JSON');
  }
  if (contentType && !contentType.includes('application/json')) {
    throw new Error('Received non-JSON response');
  }

  return JSON.parse(text) as T;
}
