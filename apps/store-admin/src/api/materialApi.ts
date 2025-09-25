import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Material, MaterialCreateDto, MaterialUpdateDto } from './types/material';
import api from './axiosConfig';
import { ApiEnvelope } from './types/common';

export const useMaterials = () => {
  return useQuery<Material[]>({
    queryKey: ['materials'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<Material[]>>('/api/materials');
      return response.data.data;
    },
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MaterialCreateDto) => {
      const response = await api.post<ApiEnvelope<{ id: number }>>('/api/admin/materials', data);
      return response.data.data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & MaterialUpdateDto) => {
      const response = await api.put<ApiEnvelope<{ id: number }>>(
        `/api/admin/materials/${id}`,
        data
      );
      return response.data.data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<ApiEnvelope<{ id: number }>>(`/api/admin/materials/${id}`);
      return res.data.data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};
