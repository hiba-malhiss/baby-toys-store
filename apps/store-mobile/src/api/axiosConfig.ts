import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from 'axios';
import { queryClient } from '../../App';

let inMemoryAccessToken: string | null = null;

export function setAccessToken(token: string) {
  inMemoryAccessToken = token;
}

export function clearAccessToken() {
  inMemoryAccessToken = null;
}

export function getAccessToken() {
  return inMemoryAccessToken;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// If you use locale/guest cart like web, you can add them here similarly
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers ?? {};
    if (inMemoryAccessToken) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Simple refresh flow mirroring store-front (expects /api/auth/refresh to return { accessToken })
let isRefreshing = false;
const requestQueue: { resolve: (v: any) => void; reject: (e: any) => void; config: AxiosRequestConfig }[] = [];

function processQueue(error: any, token: string | null = null) {
  requestQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (token) {
      p.config.headers = { ...p.config.headers, Authorization: `Bearer ${token}` };
      api(p.config).then(p.resolve).catch(p.reject);
    }
  });
  requestQueue.length = 0;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
      return Promise.reject(error);
    }

    if ((error.response.status === 403 || error.response.status === 419) && originalRequest) {
      clearAccessToken();
      return Promise.reject(error);
    }

    if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
      const isRefreshCall = (originalRequest.url || '').includes('/api/auth/refresh');
      if (isRefreshCall) {
        clearAccessToken();
        return Promise.reject(error);
      }
      if (isRefreshing) {
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
        processQueue(null, accessToken);
        if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        processQueue(refreshError);
        // Optionally invalidate queries on failure
        queryClient.invalidateQueries();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const data: any = error.response?.data as any;
    if (data?.message && typeof data.message === 'string') {
      error.message = data.message;
    }

    return Promise.reject(error);
  }
);

export default api;
