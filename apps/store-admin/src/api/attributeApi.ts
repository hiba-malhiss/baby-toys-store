import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import type { AttributeType, AttributeTypeUpsertRequest } from './types/attribute';

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
};

// ---- Queries ----
export const useAttributeTypes = () =>
  useQuery<AttributeType[]>({
    queryKey: ['attributeTypes'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<any[]>>('/api/admin/attributes/types');
      const raw = res.data.data ?? [];
      // Map backend admin DTOs to frontend types (no recursion). Keep translations for edit prefill.
      const safe: AttributeType[] = raw.map((t: any) => ({
        id: t.id,
        code: t.code,
        isFilterable: !!t.isFilterable,
        isMultiselect: !!t.isMultiselect,
        isActive: !!t.isActive,
        sortOrder: Number(t.sortOrder ?? 0),
        displayName: t.displayName ?? null,
        translations: Array.isArray(t.translations)
          ? t.translations.map((tr: any) => ({
              locale: tr.locale,
              displayName: tr.displayName ?? null,
              description: tr.description ?? null,
            }))
          : undefined,
        values: Array.isArray(t.values)
          ? t.values.map((v: any) => ({
              id: v.id,
              code: v.code,
              display: v.display ?? null,
              sortOrder: v.sortOrder,
              isActive: v.isActive,
              translations: Array.isArray(v.translations)
                ? v.translations.map((tr: any) => ({
                    locale: tr.locale,
                    displayValue: tr.displayValue ?? null,
                  }))
                : undefined,
            }))
          : [],
      }));
      return safe;
    },
  });

// ---- Mutations ----
export const useCreateAttributeType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async(payload: AttributeTypeUpsertRequest) => {
      // Backend returns ApiResponse-wrapped DTO
      const res = await api.post<ApiResponse<any>>('/api/admin/attributes/types', payload);
      return res.data.data?.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attributeTypes'] }),
  });
};

export const useUpdateAttributeType = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async(payload: AttributeTypeUpsertRequest) => {
      const res = await api.put<ApiResponse<any>>(`/api/admin/attributes/types/${id}`, payload);
      return res.data.data?.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attributeTypes'] }),
  });
};

export const useDeleteAttributeType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async(id: number) => {
      await api.delete(`/api/admin/attributes/types/${id}`);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attributeTypes'] }),
  });
};

export const useCreateAttributeValue = (typeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async(payload: {
      code: string;
      display?: string | null;
      sortOrder?: number;
      isActive?: boolean;
      displayByLocale?: Record<string, string>
    }) => {
      const params: Record<string, any> = { code: payload.code };
      if(payload.sortOrder != null) params.sortOrder = payload.sortOrder;
      if(payload.isActive != null) params.isActive = payload.isActive;
      // Prefer explicit displayByLocale, fallback to single-locale 'en'
      const body = payload.displayByLocale ?? (payload.display ? { en: payload.display } : undefined);
      const res = await api.post<ApiResponse<any>>(
        `/api/admin/attributes/types/${typeId}/values`,
        body,
        { params }
      );
      return res.data.data?.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attributeTypes'] }),
  });
};

export const useUpdateAttributeValue = (valueId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async(payload: {
      sortOrder?: number;
      isActive?: boolean;
      display?: string | null;
      displayByLocale?: Record<string, string>
    }) => {
      const params: Record<string, any> = {};
      if(payload.sortOrder != null) params.sortOrder = payload.sortOrder;
      if(payload.isActive != null) params.isActive = payload.isActive;
      const body = payload.displayByLocale ?? (payload.display ? { en: payload.display } : undefined);
      const res = await api.put<ApiResponse<any>>(
        `/api/admin/attributes/values/${valueId}`,
        body,
        { params }
      );
      return res.data.data?.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attributeTypes'] }),
  });
};

export const useDeleteAttributeValue = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async(valueId: number) => {
      await api.delete(`/api/admin/attributes/values/${valueId}`);
      return valueId;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attributeTypes'] }),
  });
};
