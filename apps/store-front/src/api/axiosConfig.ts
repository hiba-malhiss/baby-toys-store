import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

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

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true, // sends refresh cookie automatically
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

let isRefreshing = false;
let subscribers: ((token: string | null) => void)[] = [];

function onRefreshed(token: string | null){
  subscribers.forEach(cb => cb(token));
  subscribers = [];
}

function addSubscriber(cb: (token: string | null) => void){
  subscribers.push(cb);
}

// Attach Authorization header
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers = config.headers ?? {};
  if(inMemoryAccessToken) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

// Handle response errors and token refresh
api.interceptors.response.use(
  res => res,
  async(error: AxiosError) => {
    if(!error.response) {
      error.message = 'Network error. Please check your connection.';
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if(error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if(!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await api.post<{ accessToken: string; tokenType: string }>("/api/auth/refresh");
          const newToken = res.data.accessToken;
          setAccessToken(newToken);
          onRefreshed(newToken);
        } catch(refreshErr) {
          clearAccessToken();
          onRefreshed(null);
          throw refreshErr;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        addSubscriber((token) => {
          if(token) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    // todo: check if path is correct
    if(error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

export default api;
