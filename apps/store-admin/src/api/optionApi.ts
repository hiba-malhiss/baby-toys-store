import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import { ApiEnvelope } from './types/common';
import {
  OptionType,
  OptionValue,
  CreateOptionTypeRequest,
  CreateOptionValueRequest,
} from './types/option';

// ---- Queries ----
export const useOptionTypes = () =>
  useQuery<OptionType[]>({
    queryKey: ['optionTypes'],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<OptionType[]>>('/api/admin/options/types');
      return data.data;
    },
  });

export const useOptionValues = (typeId?: number) =>
  useQuery<OptionValue[]>({
    enabled: !!typeId,
    queryKey: ['optionValues', typeId],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<OptionValue[]>>(
        `/api/admin/options/types/${typeId}/values`
      );
      return data.data;
    },
  });

// ---- Mutations ----
export const useCreateOptionType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOptionTypeRequest) => {
      const { data } = await api.post<ApiEnvelope<{ id: number }>>(
        '/api/admin/options/types',
        payload
      );
      return data.data.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['optionTypes'] }),
  });
};

export const useCreateOptionValue = (typeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<CreateOptionValueRequest, 'optionTypeId'>) => {
      const body: CreateOptionValueRequest = { optionTypeId: typeId, ...payload };
      const { data } = await api.post<ApiEnvelope<{ id: number }>>(
        '/api/admin/options/values',
        body
      );
      return data.data.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['optionValues', typeId] }),
  });
};
