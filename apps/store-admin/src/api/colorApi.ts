import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Color, CreateColorRequest, UpdateColorRequest } from './types/color';
import api from './axiosConfig';
import { ApiEnvelope } from './types/common';

const BASE_URL = '/api/colors'; // public read
const ADMIN_BASE_URL = '/api/admin/colors'; // admin write

// ---------- Queries ----------
export const useColors = () =>
  useQuery<Color[]>({
    queryKey: ['colors'],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Color[]>>(BASE_URL);
      return res.data.data;
    },
  });

// ---------- Mutations ----------
export const useCreateColor = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, CreateColorRequest>({
    mutationFn: async (data) => {
      const res = await api.post<ApiEnvelope<{ id: number }>>(ADMIN_BASE_URL, data);
      return res.data.data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
  });
};

export const useUpdateColor = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, { id: string | number; data: UpdateColorRequest }>({
    mutationFn: async ({ id, data }) => {
      const res = await api.put<ApiEnvelope<{ id: number }>>(`${ADMIN_BASE_URL}/${id}`, data);
      return res.data.data.id;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      queryClient.invalidateQueries({ queryKey: ['colors', id] });
    },
  });
};

export const useDeleteColor = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, string | number>({
    mutationFn: async (id) => {
      const res = await api.delete<ApiEnvelope<{ id: number }>>(`${ADMIN_BASE_URL}/${id}`);
      return res.data.data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
  });
};
