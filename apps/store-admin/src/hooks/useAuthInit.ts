import { useQuery } from '@tanstack/react-query';
import api, { setAccessToken } from '../api/axiosConfig';

interface AuthInitResult {
  isAuthenticated: boolean;
}

/**
 * Admin: initialize auth on app load by attempting to refresh the JWT from httpOnly cookie.
 * If successful, sets the in-memory access token.
 */
export function useAuthInit() {
  return useQuery<AuthInitResult>({
    queryKey: ['admin-auth-init'],
    queryFn: async (): Promise<AuthInitResult> => {
      try {
        const response = await api.post<{ accessToken: string }>('/api/auth/refresh');
        if (response.data?.accessToken) {
          setAccessToken(response.data.accessToken);
          return { isAuthenticated: true };
        }
        return { isAuthenticated: false };
      } catch {
        return { isAuthenticated: false };
      }
    },
    staleTime: Infinity,
    retry: false,
  });
}
