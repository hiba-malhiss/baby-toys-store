import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosConfig';
import { getGuestCartToken, setGuestCartToken } from '../utils/guestCart';
import { AUTH_TOKEN_KEY } from "../api/authApi.ts";

interface AuthInitResult {
  isAuthenticated: boolean;
  isGuest: boolean;
}

interface GuestTokenResponse {
  token: string;
  message: string;
}

/**
 * Hook to initialize authentication on app load
 * Uses React Query for better state management and caching
 *
 * Flow:
 * 1. Try to refresh JWT access token from httpOnly cookie
 * 2. If success → User is authenticated
 * 3. If fail → User is guest, fetch guest token from backend
 */
export function useAuthInit() {
  const qc = useQueryClient();

  return useQuery<AuthInitResult>({
    queryKey: ['auth-init'],
    queryFn: async (): Promise<AuthInitResult> => {
      try {
        // Attempt to refresh access token from httpOnly refresh token cookie
        const response = await api.post<{ accessToken: string }>('/api/auth/refresh');

        if (response.data?.accessToken) {
          qc.setQueryData(AUTH_TOKEN_KEY, response.data.accessToken);
          return { isAuthenticated: true, isGuest: false };
        }

        // Shouldn't reach here, but fallback to guest
        return await initializeGuestToken();
      } catch (error) {
        // Refresh failed - user is a guest
        // Initialize guest token from backend
        return await initializeGuestToken();
      }
    },
    staleTime: Infinity, // Auth init only happens once per session
    retry: false, // Don't retry auth init
  });
}

/**
 * Initialize guest token from backend
 */
async function initializeGuestToken(): Promise<AuthInitResult> {
  if (getGuestCartToken()) return { isAuthenticated: false, isGuest: true };
  try {
    const response = await api.post<GuestTokenResponse>('/api/cart/token');
    const token = response.data?.data?.token;
    if (token) {
      setGuestCartToken(token);
      console.log('Guest token initialized from backend');
    }

    return { isAuthenticated: false, isGuest: true };
  } catch (error) {
    console.error('Failed to initialize guest token:', error);
    // Continue anyway - token will be created on first cart interaction
    return { isAuthenticated: false, isGuest: true };
  }
}
