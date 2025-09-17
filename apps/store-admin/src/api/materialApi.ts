import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Material, MaterialCreateDto, MaterialUpdateDto } from '@baby-toys/types/src';
import api from './axiosConfig';

export const useMaterials = () => {
  return useQuery<Material[]>({
    queryKey: ['materials'],
    queryFn: async () => {
      const response = await api.get('/api/materials');
      return response.data;
    },
  });
};

export const useMaterial = (id: string) => {
  return useQuery<Material>({
    queryKey: ['materials', id],
    queryFn: async () => {
      const response = await api.get(`/api/materials/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MaterialCreateDto) => {
      const response = await api.post('/api/admin/materials', data);
      return response.data;
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
      const response = await api.put(`/api/admin/materials/${id}`, data);
      return response.data;
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
      await api.delete(`/api/admin/materials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};
