import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import { queryClient } from '../main';
import { ROOT_KEYS } from './queryKeys';
import { useNavigate } from 'react-router-dom';

export enum USER_ROLE {
  ADMIN = 'ROLE_ADMIN',
}

export interface AdminUser {
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

export interface ApiErrorData {
  code?: string;
  message?: string;
}

export const AUTH_TOKEN_KEY = ['adminAuthToken'];

export const useAdminAuthToken = () =>
  useQuery<string | null>({
    queryKey: AUTH_TOKEN_KEY,
    queryFn: () => null,
    initialData: null,
    enabled: false, // manual control only
  });

export const useAdminLogin = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation<LoginResponse, AxiosError<ApiErrorData>, LoginRequest>({
    mutationKey: ['login'],
    mutationFn: async (credentials) => {
      const response = await api.post<LoginResponse>('/api/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (!data?.accessToken) return;
      qc.setQueryData(AUTH_TOKEN_KEY, data.accessToken);
      qc.invalidateQueries({ queryKey: [ROOT_KEYS.adminProfile] });
    },
    onError: (error, variables) => {
      if (error.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        const email = encodeURIComponent(variables?.email || '');
        navigate(`/admin?showVerifyDialog=1&email=${email}`, { replace: true });
      }
    },
  });
};

export const useAdminLogout = () =>
  useMutation<void, AxiosError>({
    mutationKey: ['logout'],
    mutationFn: async () => {
      await api.post('/api/auth/logout');
      queryClient.removeQueries({ queryKey: AUTH_TOKEN_KEY });
      queryClient.clear();
    },
  });

export const useFetchAdminProfile = () => {
  const { data: token } = useAdminAuthToken();

  return useQuery<AdminUser, AxiosError<ApiErrorData>>({
    queryKey: [ROOT_KEYS.adminProfile],
    enabled: !!token,
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<AdminUser>>('/users/profile');
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
