import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from 'axios';
import { queryClient } from '../App';
import type { QueryKey } from '@tanstack/react-query';
import { getGuestCartToken } from '../utils/guestCart';
import { getAppLocale } from '../components/i18n/locale.ts';
import { AUTH_TOKEN_KEY } from "./authApi.ts";

type RequestQueueItem = {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfig;
};

const failedQueries = new Set<QueryKey>();
const requestQueue: RequestQueueItem[] = [];
let isRefreshing = false;

// Axios instance
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

// Process queued requests after token refresh
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

// Attach Authorization + Locale headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers ?? {};
    const inMemoryAccessToken = queryClient.getQueryData(AUTH_TOKEN_KEY)
    // Add Authorization header for authenticated users
    if (inMemoryAccessToken) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    } else {
      // Add X-Cart-Token header for guest users
      // Token is already initialized by useAuthInit (React Query)
      const url = config.url || '';
      if (!url.includes('/api/auth/')) {
        const guestToken = getGuestCartToken();
        if (guestToken) {
          config.headers['X-Cart-Token'] = guestToken;
        }
      }
    }

    // Attach preferred locale
    (config.headers as any)['Accept-Language'] = getAppLocale() || 'ar';

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
      return Promise.reject(error);
    }

    // 403/419: forbidden or csrf/expired — clear token, don't attempt refresh
    if ((error.response.status === 403 || error.response.status === 419) && originalRequest) {
      queryClient.removeQueries({ queryKey: AUTH_TOKEN_KEY });
      return Promise.reject(error);
    }

    // 401 Unauthorized
    if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
      // If the failing request is the refresh call itself, do NOT try to refresh again (avoids deadlock)
      const isRefreshCall = (originalRequest.url || '').includes('/api/auth/refresh');
      if (isRefreshCall) {
        queryClient.removeQueries({ queryKey: AUTH_TOKEN_KEY });
        return Promise.reject(error);
      }
      if (isRefreshing) {
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
        queryClient.setQueryData(AUTH_TOKEN_KEY, accessToken);

        // Retry queued requests
        processQueue(null, accessToken);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
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

    // For other errors, attach message if available (safely)
    const data: any = error.response?.data as any;
    if (data?.message && typeof data.message === 'string') {
      error.message = data.message;
    }

    return Promise.reject(error);
  }
);

export default api;
