import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import { queryClient } from '../App.tsx';
import { ROOT_KEYS } from './queryKeys.ts';

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

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  age?: number;
  country?: string;
  townCode?: string;
}

export const AUTH_TOKEN_KEY = ['authToken'];

export const useAuthToken = () =>
  useQuery<string | null>({
    queryKey: AUTH_TOKEN_KEY,
    queryFn: () => null,
    initialData: null,
    enabled: false, // manual control only
  });

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
      if (!data?.accessToken) return;
      qc.setQueryData(AUTH_TOKEN_KEY, data.accessToken);
      qc.invalidateQueries({ queryKey: [ROOT_KEYS.profile] });
    },
  });
};

export const useLogout = () =>
  useMutation<void, AxiosError>({
    mutationKey: ['logout'],
    mutationFn: async () => {
      await api.post('/api/auth/logout');
      queryClient.removeQueries({ queryKey: AUTH_TOKEN_KEY });
      queryClient.clear();
      window.location.href = '/login';
    },
  });

export const useFetchProfile = () => {
  const { data: token } = useAuthToken();

  return useQuery<User, AxiosError>({
    queryKey: [ROOT_KEYS.profile],
    enabled: !!token,
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<User>>('/users/profile');
      return res.data.data;
    },
    retry: 1,
  });
};

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
