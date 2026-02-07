import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import { ApiEnvelope } from './types/common';
import {
  AttributeTypeAdminDto,
  AttributeTypeListDto,
  AttributeTypeUpsertRequest,
  AttributeValueAdminDto,
} from './types/attribute';

// -------- Types --------

export const useAttributeTypes = () =>
  useQuery<AttributeTypeListDto[]>({
    queryKey: ['attribute-types'],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<AttributeTypeListDto[]>>(
        '/api/admin/attributes/types'
      );
      return data.data;
    },
  });

export const useAttributeTypeAdmin = (id?: number) =>
  useQuery<AttributeTypeAdminDto>({
    enabled: !!id,
    queryKey: ['attribute-type-admin', id],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<AttributeTypeAdminDto>>(
        `/api/admin/attributes/types/${id}`
      );
      return data.data;
    },
  });

export const useCreateAttributeType = () => {
  const qc = useQueryClient();
  return useMutation<number, unknown, AttributeTypeUpsertRequest>({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiEnvelope<{ id: number }>>(
        '/api/admin/attributes/types',
        payload
      );
      return data.data.id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attribute-types'] });
    },
  });
};

export const useUpdateAttributeType = () => {
  const qc = useQueryClient();
  return useMutation<number, unknown, { id: number; payload: AttributeTypeUpsertRequest }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put<ApiEnvelope<{ id: number }>>(
        `/api/admin/attributes/types/${id}`,
        payload
      );
      return data.data.id;
    },
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: ['attribute-types'] });
      qc.invalidateQueries({ queryKey: ['attribute-type-admin', id] });
    },
  });
};

export const useDeleteAttributeType = () => {
  const qc = useQueryClient();
  return useMutation<void, unknown, number>({
    mutationFn: async (id) => {
      await api.delete<ApiEnvelope<void>>(`/api/admin/attributes/types/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attribute-types'] });
    },
  });
};

// -------- Values --------

type CreateAttributeValueArgs = {
  code: string;
  sortOrder?: number;
  isActive?: boolean;
  displayByLocale?: Record<string, string>;
};

export const useCreateAttributeValue = (typeId: number) => {
  const qc = useQueryClient();
  return useMutation<AttributeValueAdminDto, unknown, CreateAttributeValueArgs>({
    mutationFn: async ({ code, sortOrder, isActive, displayByLocale }) => {
      const { data } = await api.post<ApiEnvelope<AttributeValueAdminDto>>(
        `/api/admin/attributes/types/${typeId}/values`,
        displayByLocale ?? {},
        { params: { code, sortOrder, isActive } }
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attribute-type-admin', typeId] });
      qc.invalidateQueries({ queryKey: ['attribute-types'] });
    },
  });
};

type UpdateAttributeValueArgs = {
  valueId: number;
  sortOrder?: number;
  isActive?: boolean;
  displayByLocale?: Record<string, string>;
};

export const useUpdateAttributeValue = (typeId?: number) => {
  const qc = useQueryClient();
  return useMutation<AttributeValueAdminDto, unknown, UpdateAttributeValueArgs>({
    mutationFn: async ({ valueId, sortOrder, isActive, displayByLocale }) => {
      const { data } = await api.put<ApiEnvelope<AttributeValueAdminDto>>(
        `/api/admin/attributes/values/${valueId}`,
        displayByLocale ?? {},
        { params: { sortOrder, isActive } }
      );
      return data.data;
    },
    onSuccess: () => {
      if (typeId) {
        qc.invalidateQueries({ queryKey: ['attribute-type-admin', typeId] });
      }
    },
  });
};

export const useDeleteAttributeValue = (typeId?: number) => {
  const qc = useQueryClient();
  return useMutation<void, unknown, number>({
    mutationFn: async (valueId) => {
      await api.delete<ApiEnvelope<void>>(`/api/admin/attributes/values/${valueId}`);
    },
    onSuccess: () => {
      if (typeId) {
        qc.invalidateQueries({ queryKey: ['attribute-type-admin', typeId] });
      }
    },
  });
};
