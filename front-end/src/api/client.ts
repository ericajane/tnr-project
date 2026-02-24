const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
}

async function request<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const { method = 'GET', body, headers = {} } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`${method} ${path} → ${response.status}: ${errorText}`);
  }

  // Handle empty responses (e.g. 204 No Content)
  const contentType = response.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/json')) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}

export const apiClient = {
  get: <TResponse>(path: string, headers?: Record<string, string>) =>
    request<TResponse>(path, { method: 'GET', headers }),

  post: <TResponse, TBody = unknown>(path: string, body: TBody, headers?: Record<string, string>) =>
    request<TResponse, TBody>(path, { method: 'POST', body, headers }),

  put: <TResponse, TBody = unknown>(path: string, body: TBody, headers?: Record<string, string>) =>
    request<TResponse, TBody>(path, { method: 'PUT', body, headers }),

  patch: <TResponse, TBody = unknown>(path: string, body: TBody, headers?: Record<string, string>) =>
    request<TResponse, TBody>(path, { method: 'PATCH', body, headers }),

  delete: <TResponse>(path: string, headers?: Record<string, string>) =>
    request<TResponse>(path, { method: 'DELETE', headers }),
};
