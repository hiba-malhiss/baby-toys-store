import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Material, MaterialUpsertRequest, MaterialDetailsAdminDto } from './types/material';
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
    mutationFn: async (payload: MaterialUpsertRequest) => {
      const response = await api.post<ApiEnvelope<{ id: number }>>('/api/admin/materials', payload);
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
    mutationFn: async ({ id, ...payload }: { id: number } & MaterialUpsertRequest) => {
      const response = await api.put<ApiEnvelope<{ id: number }>>(
        `/api/admin/materials/${id}`,
        payload
      );
      return response.data.data.id;
    },
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ['material-admin', variables.id] });
      }
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete<ApiEnvelope<{ id: number }>>(`/api/admin/materials/${id}`);
      return res.data.data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};

export const useMaterialAdmin = (id?: number) => {
  return useQuery<MaterialDetailsAdminDto>({
    queryKey: ['material-admin', id],
    enabled: !!id,
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<MaterialDetailsAdminDto>>(
        `/api/admin/materials/${id}`
      );
      return response.data.data;
    },
  });
};
