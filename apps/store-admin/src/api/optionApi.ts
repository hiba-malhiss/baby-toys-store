import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import { ApiEnvelope } from './types/common';
import {
  OptionTypeDetailDto,
  OptionTypeDto,
  OptionTypeUpsertRequest,
  OptionValueUpdateRequest,
} from './types/option';

// ------ Types ------

export const useOptionTypes = () =>
  useQuery<OptionTypeDto[]>({
    queryKey: ['option-types'],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<OptionTypeDto[]>>('/api/admin/options/types');
      return data.data;
    },
  });

export const useOptionTypeDetail = (id?: number) =>
  useQuery<OptionTypeDetailDto>({
    enabled: !!id,
    queryKey: ['option-type', id],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<OptionTypeDetailDto>>(
        `/api/admin/options/types/${id}`
      );
      return data.data;
    },
  });

export const useCreateOptionType = () => {
  const qc = useQueryClient();
  return useMutation<number, unknown, OptionTypeUpsertRequest>({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiEnvelope<{ id: number }>>(
        '/api/admin/options/types',
        payload
      );
      return data.data.id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['option-types'] });
    },
  });
};

export const useUpdateOptionType = () => {
  const qc = useQueryClient();
  return useMutation<number, unknown, { id: number; payload: OptionTypeUpsertRequest }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put<ApiEnvelope<{ id: number }>>(
        `/api/admin/options/types/${id}`,
        payload
      );
      return data.data.id;
    },
    onSuccess: (_id, { id }) => {
      qc.invalidateQueries({ queryKey: ['option-types'] });
      qc.invalidateQueries({ queryKey: ['option-type', id] });
    },
  });
};

export const useDeleteOptionType = () => {
  const qc = useQueryClient();
  return useMutation<number, unknown, number>({
    mutationFn: async (id) => {
      const { data } = await api.delete<ApiEnvelope<{ id: number }>>(
        `/api/admin/options/types/${id}`
      );
      return data.data.id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['option-types'] });
    },
  });
};

// ------ Values ------

export const useCreateOptionValue = (typeId: number) => {
  const qc = useQueryClient();
  return useMutation<number, unknown, { code: string; displayByLocale?: Record<string, string> }>({
    mutationFn: async ({ code, displayByLocale }) => {
      const { data } = await api.post<ApiEnvelope<{ id: number }>>(
        `/api/admin/options/types/${typeId}/values`,
        displayByLocale ?? {},
        { params: { code } }
      );
      return data.data.id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['option-type', typeId] });
      qc.invalidateQueries({ queryKey: ['option-types'] });
    },
  });
};

export const useUpdateOptionValue = (typeId?: number) => {
  const qc = useQueryClient();
  return useMutation<number, unknown, { valueId: number; payload: OptionValueUpdateRequest }>({
    mutationFn: async ({ valueId, payload }) => {
      const { data } = await api.put<ApiEnvelope<{ id: number }>>(
        `/api/admin/options/values/${valueId}`,
        payload
      );
      return data.data.id;
    },
    onSuccess: (_id, vars) => {
      qc.invalidateQueries({ queryKey: ['option-value', vars.valueId] });
      if (typeId) qc.invalidateQueries({ queryKey: ['option-type', typeId] });
    },
  });
};

export const useDeleteOptionValue = (typeId?: number) => {
  const qc = useQueryClient();
  return useMutation<number, unknown, number>({
    mutationFn: async (valueId) => {
      const { data } = await api.delete<ApiEnvelope<{ id: number }>>(
        `/api/admin/options/values/${valueId}`
      );
      return data.data.id;
    },
    onSuccess: (_id, valueId) => {
      qc.invalidateQueries({ queryKey: ['option-value', valueId] });
      if (typeId) qc.invalidateQueries({ queryKey: ['option-type', typeId] });
    },
  });
};
