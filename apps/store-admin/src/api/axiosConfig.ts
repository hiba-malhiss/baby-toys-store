import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig, type AxiosRequestConfig } from 'axios';
import type { QueryKey } from '@tanstack/react-query';
import { queryClient } from '../App';
import { getAppLocale } from '../components/i18n/locale';

type RequestQueueItem = {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfig;
};

const failedQueries = new Set<QueryKey>();
const requestQueue: RequestQueueItem[] = [];
let isRefreshing = false;

let inMemoryAccessToken: string | null = null;

export function setAccessToken(token: string){
  inMemoryAccessToken = token;
}

export function clearAccessToken(){
  inMemoryAccessToken = null;
}

export function getAccessToken(){
  return inMemoryAccessToken;
}

// Simple redirect helper that respects Vite base (e.g., /admin/)
function redirectToLogin(){
  if (typeof window !== 'undefined') {
    const base = (import.meta as any).env?.BASE_URL || '/';
    const target = (base.endsWith('/') ? base : base + '/') + 'login';
    window.location.href = target;
  }
}

// Axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Process queued requests after token refresh
function processQueue(error: any, token: string | null = null){
  requestQueue.forEach(promise => {
    if(error) {
      promise.reject(error);
    } else if(token) {
      promise.config.headers = {
        ...promise.config.headers,
        Authorization: `Bearer ${token}`,
      };
      api(promise.config).then(promise.resolve).catch(promise.reject);
    }
  });
  requestQueue.length = 0;
}

// Attach Authorization and language headers
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers = config.headers ?? {};
  if(inMemoryAccessToken) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  // Always attach preferred locale (align default with store-front)
  (config.headers as any)['Accept-Language'] = getAppLocale() || 'ar';
  return config;
});

// Handle response errors and token refresh
api.interceptors.response.use(
  response => response,
  async(error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Network errors
    if(!error.response) {
      error.message = 'Network error. Please check your connection.';
      return Promise.reject(error);
    }

    // 403/419: forbidden or csrf/expired — clear token and redirect
    if ((error.response.status === 403 || error.response.status === 419) && originalRequest) {
      clearAccessToken();
      failedQueries.forEach(key => queryClient.invalidateQueries(key));
      failedQueries.clear();
      redirectToLogin();
      return Promise.reject(error);
    }

    // 401 Unauthorized handling with refresh
    if (error.response.status === 401 && originalRequest) {
      // Never try to refresh when the refresh endpoint itself fails
      const isRefreshCall = (originalRequest.url || '').includes('/api/auth/refresh');
      if (isRefreshCall) {
        clearAccessToken();
        processQueue(error);
        failedQueries.forEach(key => queryClient.invalidateQueries(key));
        failedQueries.clear();
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        // Already retried this request once; avoid loops
        return Promise.reject(error);
      }

      if(isRefreshing) {
        // Queue request if token is being refreshed
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const response = await api.post<{ accessToken: string }>('/api/auth/refresh');

        const { accessToken } = response.data;
        setAccessToken(accessToken);

        // Retry queued requests
        processQueue(null, accessToken);

        // Retry original request
        if(originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch(refreshError: any) {
        clearAccessToken();
        processQueue(refreshError);

        // Invalidate failed queries
        failedQueries.forEach(key => queryClient.invalidateQueries(key));
        failedQueries.clear();
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, attach message if available
    const data: any = error.response?.data as any;
    if(data?.message) {
      error.message = data.message as string;
    }

    return Promise.reject(error);
  },
);

export default api;
