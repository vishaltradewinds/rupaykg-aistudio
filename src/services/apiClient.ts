export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface ApiRequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | null | undefined>;
}

export interface ApiErrorResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export class ApiError extends Error {
  readonly response: ApiErrorResponse;
  readonly status: number;
  readonly isAuthenticationError: boolean;
  readonly isServerError: boolean;

  constructor(message: string, response: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
    this.status = response.status;
    this.isAuthenticationError = response.status === 401;
    this.isServerError = response.status >= 500;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

class ApiClient {
  private readonly baseURL = '/api';
  private readonly timeout = 10000;

  private async request<T>(method: string, url: string, body?: unknown, config: ApiRequestConfig = {}): Promise<ApiResponse<T>> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(config.params || {})) {
      if (value !== null && value !== undefined) params.set(key, String(value));
    }

    const normalizedUrl = url.startsWith('http') ? url : `${this.baseURL}${url.startsWith('/') ? url : `/${url}`}`;
    const requestUrl = params.size ? `${normalizedUrl}${normalizedUrl.includes('?') ? '&' : '?'}${params.toString()}` : normalizedUrl;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const headers = new Headers(config.headers);
    if (body !== undefined && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) headers.set('Authorization', `Bearer ${token}`);

    try {
      const response = await fetch(requestUrl, {
        ...config,
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: config.signal || controller.signal,
      });

      const text = await response.text();
      let data: T;
      try {
        data = text ? JSON.parse(text) as T : undefined as T;
      } catch {
        data = text as T;
      }

      if (!response.ok) {
        if (response.status === 401) console.warn('Unauthorized. Token may be expired.');
        const responseData: ApiErrorResponse<T> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        };
        throw new ApiError(`HTTP error! status: ${response.status}`, responseData);
      }

      return { data, status: response.status, statusText: response.statusText, headers: response.headers };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T = unknown>(url: string, config?: ApiRequestConfig) {
    return this.request<T>('GET', url, undefined, config);
  }

  post<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig) {
    return this.request<T>('POST', url, data, config);
  }

  put<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig) {
    return this.request<T>('PUT', url, data, config);
  }

  patch<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig) {
    return this.request<T>('PATCH', url, data, config);
  }

  delete<T = unknown>(url: string, config?: ApiRequestConfig) {
    return this.request<T>('DELETE', url, undefined, config);
  }
}

export default new ApiClient();
