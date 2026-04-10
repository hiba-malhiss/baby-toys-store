import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosConfig';
import { AUTH_TOKEN_KEY } from '../api/authApi';

interface AdminAuthInitResult {
  isAuthenticated: boolean;
}

/**
 * Hook to initialize admin authentication on app load
 * Uses React Query for better state management and caching
 *
 * Flow:
 * 1. Try to refresh JWT access token from httpOnly refresh token cookie
 * 2. If success -> Admin is authenticated
 * 3. If fail -> Admin is not authenticated
 */
export function useAdminAuthInit() {
  const qc = useQueryClient();

  return useQuery<AdminAuthInitResult>({
    queryKey: ['admin-auth-init'],
    queryFn: async (): Promise<AdminAuthInitResult> => {
      try {
        // Attempt to refresh access token from httpOnly refresh token cookie
        const response = await api.post<{ accessToken: string }>('/api/auth/refresh');

        if (response.data?.accessToken) {
          qc.setQueryData(AUTH_TOKEN_KEY, response.data.accessToken);
          return { isAuthenticated: true };
        }

        // Shouldn't reach here, but fallback to not authenticated
        return { isAuthenticated: false };
      } catch (error) {
        // Refresh failed - admin is not authenticated
        return { isAuthenticated: false };
      }
    },
    staleTime: Infinity, // Auth init only happens once per session
    retry: false, // Don't retry auth init
  });
}
