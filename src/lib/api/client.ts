import { useAuthStore } from '@lib/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestConfig extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  method: RequestMethod = 'GET',
  config: RequestConfig = {}
): Promise<T> {
  const { token, headers: customHeaders, ...restConfig } = config;

  const authStore = useAuthStore.getState();
  const authToken = token || authStore.token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...customHeaders,
  };

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers,
      ...restConfig,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.error || data.message || 'Error en la solicitud',
        data.code
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(0, 'Error de conexión. Verificá tu conexión a internet.');
    }
    throw new ApiError(500, 'Error inesperado. Intentá de nuevo más tarde.');
  }
}

export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, 'GET', config),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, 'POST', {
      ...config,
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, 'PUT', {
      ...config,
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, 'PATCH', {
      ...config,
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, 'DELETE', config),
};

export default api;
