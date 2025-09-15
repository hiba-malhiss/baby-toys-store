import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from './axiosConfig';

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
    mutationFn: async(data: RegisterRequest) => {
      const response = await api.post<{ accessToken: string }>('/api/auth/register', data);
      return response.data;
    },
  });

export const useLogin = () =>
  useMutation<LoginResponse, AxiosError<{ message: string }>, { email: string; password: string }>({
    mutationKey: ['login'],
    mutationFn: async(credentials) => {
      const response = await api.post<LoginResponse>('/api/auth/login', credentials);
      return response.data;
    },
  });

export const useLogout = () =>
  useMutation<void, AxiosError>({
    mutationKey: ['logout'],
    mutationFn: async() => {
      await api.post('/api/auth/logout');
    },
  });

export const useFetchProfile = () =>
  useQuery<User, AxiosError>({
    queryKey: ['profile'],
    queryFn: async() => {
      const response = await api.get<User>('/users/profile');
      return response.data;
    },
    retry: 1,
  });

export interface VerifyEmailResponse {
  message: string;
}

export const useVerifyEmail = (token: string) =>
  useQuery<VerifyEmailResponse, AxiosError<{ message: string }>>({
    queryKey: ['verifyEmail', token],
    queryFn: async() => {
      const response = await api.get<VerifyEmailResponse>('/api/auth/verify-email', {
        params: { token },
      });
      return response.data;
    },
    enabled: !!token,
    retry: 0
  });