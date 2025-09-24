import { useMutation, useQuery } from '@tanstack/react-query';
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

export const useLogin = () =>
  useMutation<LoginResponse, AxiosError<{ message: string }>, LoginRequest>({
    mutationKey: ['login'],
    mutationFn: async (credentials) => {
      const response = await api.post<LoginResponse>('/api/auth/login', credentials);
      return response.data;
    },
  });

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
