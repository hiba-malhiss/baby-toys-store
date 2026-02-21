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

export interface ApiErrorData {
  code?: string;
  message?: string;
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
  useMutation<{ accessToken: string }, AxiosError<ApiErrorData>, RegisterRequest>({
    mutationKey: ['register'],
    mutationFn: async (data: RegisterRequest) => {
      const response = await api.post<{ accessToken: string }>('/api/auth/register', data);
      return response.data;
    },
  });

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation<LoginResponse, AxiosError<ApiErrorData>, LoginRequest>({
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
    onError: (error, variables) => {
      if (error.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        const email = encodeURIComponent(variables?.email || '');
        window.location.href = `/?showVerifyDialog=1&email=${email}`;
      }
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
    },
  });

export const useFetchProfile = () => {
  const { data: token } = useAuthToken();

  return useQuery<User, AxiosError<ApiErrorData>>({
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
  useQuery<VerifyEmailResponse, AxiosError<ApiErrorData>>({
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
  useMutation<ForgotPasswordResponse, AxiosError<ApiErrorData>, ForgotPasswordRequest>({
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
  useMutation<{ message: string }, AxiosError<ApiErrorData>, ResetPasswordRequest>({
    mutationKey: ['resetPassword'],
    mutationFn: async (data) => {
      const res = await api.post('/api/auth/password/reset', data);
      return res.data;
    },
  });

export const useValidateResetToken = (token: string) =>
  useQuery<{ message: string }, AxiosError<ApiErrorData>>({
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

export interface ResendVerificationResponse {
  message: string;
}

export const useResendVerification = () =>
  useMutation<ResendVerificationResponse, AxiosError<ApiErrorData>, { token: string }>({
    mutationKey: ['resendVerification'],
    mutationFn: async ({ token }) => {
      const res = await api.post<ResendVerificationResponse>(
        '/api/auth/verify-email/resend',
        null,
        { params: { token } }
      );
      return res.data;
    },
  });

export const useResendVerificationByEmail = () =>
  useMutation<ResendVerificationResponse, AxiosError<ApiErrorData>, { email: string }>({
    mutationKey: ['resendVerificationByEmail'],
    mutationFn: async ({ email }) => {
      const res = await api.post<ResendVerificationResponse>(
        '/api/auth/verify-email/resend-by-email',
        null,
        { params: { email } }
      );
      return res.data;
    },
  });
