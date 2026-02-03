import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import { ApiEnvelope } from './types/common';
import { VariantDto, CreateVariantRequest, UpdateVariantRequest } from './types/variant';

export const useVariants = (productId?: number) =>
  useQuery<VariantDto[]>({
    enabled: !!productId,
    queryKey: ['variants', productId],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<VariantDto[]>>(
        `/api/admin/products/${productId}/variants`
      );
      return data.data;
    },
  });

export const useCreateVariant = (productId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateVariantRequest) => {
      const { data } = await api.post<ApiEnvelope<{ id: number }>>(
        `/api/admin/products/${productId}/variants`,
        payload
      );
      return data.data.id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['variants', productId] });
      qc.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
};

export const useUpdateVariant = (productId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      variantId,
      payload,
    }: {
      variantId: number;
      payload: UpdateVariantRequest;
    }) => {
      await api.put<ApiEnvelope<void>>(`/api/admin/variants/${variantId}`, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['variants', productId] });
      qc.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
};

export const useDeleteVariant = (productId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (variantId: number) => {
      await api.delete<ApiEnvelope<void>>(`/api/admin/variants/${variantId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['variants', productId] });
      qc.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
};
