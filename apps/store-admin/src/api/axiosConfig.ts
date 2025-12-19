import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
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
let isRedirecting = false; // prevent multiple redirects

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

function safeRedirectToLogin(){
  if(isRedirecting) return;
  isRedirecting = true;

  if(typeof window !== 'undefined') {
    const base = (import.meta as any).env?.BASE_URL || '/';
    const target = (base.endsWith('/') ? base : `${base}/`) + 'login';
    window.location.href = target;
  }
}

// Axios instances
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
});

function processQueue(error: any, token: string | null = null){
  requestQueue.forEach((promise) => {
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
  (response) => response,
  async(error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if(!error.response || !originalRequest) {
      error.message = 'Network error. Please check your connection.';
      return Promise.reject(error);
    }

    const status = error.response.status;

    const isRefreshCall =
      (originalRequest.url || '').includes('/api/auth/refresh');

    // Handle refresh call failure separately (prevents infinite loop)
    if(isRefreshCall && (status === 401 || status === 403)) {
      clearAccessToken();
      processQueue(error);
      // Do NOT redirect immediately; let login page handle it
      return Promise.reject(error);
    }

    // Only try refresh if user has a token and it's not the refresh call itself
    if((status === 401 || status === 403) && !originalRequest._retry) {
      if(!inMemoryAccessToken) {
        clearAccessToken();
        processQueue(error);
        safeRedirectToLogin();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if(isRefreshing) {
        // Queue request if token is being refreshed
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const response = await refreshApi.post<{ accessToken: string }>(
          '/api/auth/refresh'
        );
        const { accessToken } = response.data;
        setAccessToken(accessToken);

        // Retry queued requests
        processQueue(null, accessToken);

        // Retry original request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        return api(originalRequest);
      } catch(refreshError) {
        clearAccessToken();
        processQueue(refreshError);

        // Invalidate failed queries
        failedQueries.forEach(key => queryClient.invalidateQueries(key));
        failedQueries.clear();

        // Redirect safely
        setTimeout(() => safeRedirectToLogin(), 0);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Other errors: attach message if available
    const data: any = error.response.data;
    if(data?.message) {
      error.message = data.message;
    }

    return Promise.reject(error);
  }
);

export default api;
