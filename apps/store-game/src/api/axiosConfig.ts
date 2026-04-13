import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from 'axios';
import { queryClient } from '../main';
import type { QueryKey } from '@tanstack/react-query';
import { AUTH_TOKEN_KEY } from './authApi';

type RequestQueueItem = {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfig;
};

const failedQueries = new Set<QueryKey>();
const requestQueue: RequestQueueItem[] = [];
let isRefreshing = false;

// Process queued requests
function processQueue(error: any, token: string | null = null) {
  requestQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.config.headers = {
        ...promise.config.headers,
        Authorization: `Bearer ${token}`,
      };
      api(promise.config).then(promise.resolve).catch(promise.reject);
    }
  });
  requestQueue.length = 0;
}

// Axios instances
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Clean instance for refresh only (no interceptors)
const refreshApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  withCredentials: true,
});

// Attach Authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers ?? {};
    const token = queryClient.getQueryData<string>(AUTH_TOKEN_KEY);

    // Add Authorization header for authenticated admin users
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response || !originalRequest) {
      error.message = 'Network error. Please check your connection.';
      return Promise.reject(error);
    }

    const status = error.response.status;
    const data = error.response.data;
    const isRefreshCall = (originalRequest.url || '').includes('/api/auth/refresh');

    // Only attempt refresh if user has a token and it's not the refresh call itself
    const token = queryClient.getQueryData<string>(AUTH_TOKEN_KEY);

    // Handle refresh call failure separately (prevents infinite loop)
    if (isRefreshCall && (status === 401 || status === 403)) {
      queryClient.removeQueries({ queryKey: AUTH_TOKEN_KEY });
      processQueue(error);
      return Promise.reject(error);
    }

    // Only try refresh if user has a token and it's not the refresh call itself
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      if (!token) {
        queryClient.removeQueries({ queryKey: AUTH_TOKEN_KEY });
        processQueue(error);
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const response = await refreshApi.post<{ accessToken: string }>('/api/auth/refresh');
        const { accessToken } = response.data;
        queryClient.setQueryData(AUTH_TOKEN_KEY, accessToken);

        // Retry queued requests
        processQueue(null, accessToken);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed
        queryClient.removeQueries({ queryKey: AUTH_TOKEN_KEY });
        processQueue(refreshError);

        // Invalidate failed queries
        failedQueries.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
        failedQueries.clear();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize rate limiting (429) to a typed error with Retry-After
    if (status === 429) {
      const headers: any = error.response.headers || {};
      const retryHeader = headers['retry-after'] ?? headers['Retry-After'];
      const retryAfter = retryHeader ? parseInt(String(retryHeader), 10) : undefined;
      const message = (data?.message as string) || 'Too many requests. Please try again later.';
      const reason = (data?.reason as string) || (data?.code as string) || undefined;
      const RateLimitError = class extends Error {
        constructor(
          message: string,
          public retryAfter?: number,
          public reason?: string
        ) {
          super(message);
          this.name = 'RateLimitError';
        }
      };
      return Promise.reject(new RateLimitError(message, retryAfter, reason));
    }

    // Other errors: attach backend message if available
    if (data?.message && typeof data.message === 'string') {
      error.message = data.message;
    }

    return Promise.reject(error);
  }
);

export default api;
