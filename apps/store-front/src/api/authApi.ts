import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api, { clearAccessToken, setAccessToken } from './axiosConfig';
import type { ApiEnvelope } from '../../store-admin/src/api/types/common';
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

export interface RefreshResponse {
  accessToken: string;
  tokenType: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export const useRegister = () =>
  useMutation<{ accessToken: string }, AxiosError<{ message?: string }>, RegisterRequest>({
    mutationKey: ['register'],
    mutationFn: async (data: RegisterRequest) => {
      const response = await api.post<{ accessToken: string }>('/api/auth/register', data);
      return response.data;
    },
  });

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation<LoginResponse, AxiosError<{ message: string }>, LoginRequest>({
    mutationKey: ['login'],
    mutationFn: async (credentials) => {
      const response = await api.post<LoginResponse>('/api/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Save access token for subsequent authenticated requests
      if (data?.accessToken) setAccessToken(data.accessToken);
      // Invalidate queries that depend on auth (use predicate to catch param variants)
      qc.invalidateQueries({ queryKey: ['profile'] });
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'myWishlist',
      });
      qc.invalidateQueries({ queryKey: ['wishlistCount'] });
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'products',
      });
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'relatedProducts',
      });
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'highlights',
      });
      // Proactively refetch critical ones if already mounted
      setTimeout(() => {
        qc.refetchQueries({ queryKey: ['profile'] });
        qc.refetchQueries({
          predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'myWishlist',
        });
        qc.refetchQueries({ queryKey: ['wishlistCount'] });
      }, 100);
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

export const useFetchProfile = () =>
  useQuery<User, AxiosError>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<User>>('/users/profile');
      return response.data.data;
    },
    retry: 1,
  });

export interface VerifyEmailResponse {
  message: string;
}

export const useVerifyEmail = (token: string) =>
  useQuery<VerifyEmailResponse, AxiosError<{ message: string }>>({
    queryKey: ['verifyEmail', token],
    queryFn: async () => {
      const response = await api.get<VerifyEmailResponse>('/api/auth/verify-email', {
        params: { token },
      });
      return response.data;
    },
    enabled: !!token,
    retry: 0,
  });

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export const useForgotPassword = () =>
  useMutation<ForgotPasswordResponse, AxiosError<{ message?: string }>, ForgotPasswordRequest>({
    mutationKey: ['forgotPassword'],
    mutationFn: async (payload) => {
      const res = await api.post<ForgotPasswordResponse>('/api/auth/password/forgot', payload);
      return res.data;
    },
  });

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const useResetPassword = () =>
  useMutation<{ message: string }, AxiosError<{ message?: string }>, ResetPasswordRequest>({
    mutationKey: ['resetPassword'],
    mutationFn: async (data) => {
      const res = await api.post('/api/auth/password/reset', data);
      return res.data;
    },
  });

export const useValidateResetToken = (token: string) =>
  useQuery<{ message: string }, AxiosError<{ message?: string }>>({
    queryKey: ['validateResetToken', token],
    queryFn: async () => {
      const res = await api.get('/api/auth/password/validate-token', {
        params: { token },
      });
      return res.data;
    },
    enabled: !!token,
    retry: 0,
  });
