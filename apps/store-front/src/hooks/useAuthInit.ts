import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosConfig';
import { getGuestCartToken, setGuestCartToken } from '../utils/guestCart';
import { AUTH_TOKEN_KEY } from '../api/authApi.ts';

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
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const maxAttempts = 3;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      const response = await api.post<GuestTokenResponse | { data?: { token?: string } }>(
        '/api/cart/token'
      );
      const token = (response as any)?.data?.data?.token || (response as any)?.data?.token;
      if (token) {
        setGuestCartToken(token);
        if (attempt > 0) console.log('Guest token initialized after retry:', attempt + 1);
        else console.log('Guest token initialized from backend');
        break;
      }
      // No token in response - treat as failure to retry
      throw new Error('No guest token in response');
    } catch (error) {
      attempt += 1;
      console.error(`Failed to initialize guest token (attempt ${attempt}):`, error);
      if (attempt >= maxAttempts) {
        // Give up but continue as guest; token may be created on first cart interaction
        break;
      }
      // Exponential backoff: 200ms, 400ms, 800ms
      const delay = 200 * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }

  return { isAuthenticated: false, isGuest: true };
}
