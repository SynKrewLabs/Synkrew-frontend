/**
 * SynKrew — API Client Wrapper
 * Path: lib/api-client.ts
 *
 * Provides typed fetch request execution, auth interceptors, and mock latency simulation.
 */

import { Config } from '../config/api';
import { AuthStorage } from './auth-storage';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code: string = 'API_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Artificial latency helper for mock service functions.
 */
export async function simulateNetworkDelay(ms: number = Config.MOCK_DELAY_MS): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Standard HTTP request wrapper (ready for real backend connection).
 */
export async function apiClient<TResponse>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
  } = {}
): Promise<TResponse> {
  const {
    method = 'GET',
    body,
    headers: customHeaders = {},
    requiresAuth = true,
  } = options;

  const url = `${Config.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...customHeaders,
  };

  if (requiresAuth) {
    const token = await AuthStorage.getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        errorData.message || 'Network request failed',
        response.status,
        errorData.code || 'HTTP_ERROR',
        errorData
      );
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError((error as Error).message || 'Unable to connect to server', 500, 'CONNECTION_ERROR');
  }
}
