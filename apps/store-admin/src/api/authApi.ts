import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api, { clearAccessToken } from './axiosConfig';
import { ApiEnvelope } from './types/common';
import { queryClient } from '../App.tsx';

export enum USER_ROLE {
  CUSTOMER = 'ROLE_CUSTOMER',
  ADMIN = 'ROLE_ADMIN',
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: USER_ROLE;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  message: string;
  role: string;
}

export const useLogin = () => {
  const qc = useQueryClient();

  return useMutation<LoginResponse, AxiosError<{ message: string }>, LoginRequest>({
    mutationKey: ['login'],
    mutationFn: async (credentials) => {
      const response = await api.post<LoginResponse>('/api/auth/login', credentials);
      return response.data;
    },
    onSuccess: () => {
      // Mark auth-init as authenticated to unblock profile fetching
      qc.setQueryData(['admin-auth-init'], { isAuthenticated: true });
      qc.invalidateQueries({ queryKey: ['profile'] });
      qc.refetchQueries({ queryKey: ['profile'] });
    },
  });
};

export const useLogout = () =>
  useMutation<void, AxiosError>({
    mutationKey: ['logout'],
    mutationFn: async () => {
      await api.post('/api/auth/logout');
      clearAccessToken();
      queryClient.clear();
    },
  });

export const useFetchProfile = (enabled: boolean = true) =>
  useQuery<User, AxiosError>({
    queryKey: ['profile'],
    enabled,
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<User>>('/users/profile');
      return response.data.data;
    },
    // Avoid noisy retries that trigger UI flicker during login/init
    retry: (failureCount, error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) return false; // not authorized => don't retry
      if (!error.response) return failureCount < 2; // network error: allow 2 quick retries
      return failureCount < 1; // other errors: single retry at most
    },
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
