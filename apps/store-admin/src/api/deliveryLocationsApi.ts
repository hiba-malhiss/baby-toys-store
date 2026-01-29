import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import { useToast } from '@baby-toys/ui-kit';

const getErrMsg = (e: any, fallback = 'Operation failed') =>
  e?.response?.data?.message || e?.message || fallback;

export type AdminDeliveryTown = {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  zoneCode: string;
  feeOverride?: number | null;
  active: boolean;
};

export type AdminDeliveryZone = {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  defaultFee: number;
  active: boolean;
};

export const DELIVERY_KEYS = {
  towns: 'admin-delivery-towns',
  zones: 'admin-delivery-zones',
} as const;

export const DELIVERY_QK = {
  towns: () => [DELIVERY_KEYS.towns] as const,
  zones: () => [DELIVERY_KEYS.zones] as const,
};

export function useAdminTowns() {
  const toast = useToast();
  return useQuery<AdminDeliveryTown[]>({
    queryKey: DELIVERY_QK.towns(),
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<AdminDeliveryTown[]>>('/api/admin/delivery-towns');
      return data.data || [];
    },
    onError: (e: any) => toast.error(getErrMsg(e, 'Failed to load towns')),
    staleTime: 60_000,
  });
}

// Zones
export function useAdminZones() {
  const toast = useToast();
  return useQuery<AdminDeliveryZone[]>({
    queryKey: DELIVERY_QK.zones(),
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<AdminDeliveryZone[]>>('/api/admin/delivery-zones');
      return data.data || [];
    },
    onError: (e: any) => toast.error(getErrMsg(e, 'Failed to load zones')),
    staleTime: 60_000,
  });
}

export function useCreateZone() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ id: number }, any, Omit<AdminDeliveryZone, 'id'>>({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiEnvelope<{ id: number }>>('/api/admin/delivery-zones', payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Zone created');
      qc.invalidateQueries({ queryKey: DELIVERY_QK.zones() });
    },
    onError: (e: any) => toast.error(getErrMsg(e, 'Failed to create zone')),
  });
}

export function useUpdateZone() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ id: number }, any, { id: number } & Omit<AdminDeliveryZone, 'id'>>({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put<ApiEnvelope<{ id: number }>>(`/api/admin/delivery-zones/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Zone updated');
      qc.invalidateQueries({ queryKey: DELIVERY_QK.zones() });
    },
    onError: (e: any) => toast.error(getErrMsg(e, 'Failed to update zone')),
  });
}

export function useDeactivateZone() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ id: number }, any, { id: number }>({
    mutationFn: async ({ id }) => {
      const { data } = await api.patch<ApiEnvelope<{ id: number }>>(`/api/admin/delivery-zones/${id}/deactivate`);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Zone deactivated');
      qc.invalidateQueries({ queryKey: DELIVERY_QK.zones() });
    },
    onError: (e: any) => toast.error(getErrMsg(e, 'Failed to deactivate zone')),
  });
}

export function useCreateTown() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ id: number }, any, Omit<AdminDeliveryTown, 'id'>>({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiEnvelope<{ id: number }>>('/api/admin/delivery-towns', payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Town created');
      qc.invalidateQueries({ queryKey: DELIVERY_QK.towns() });
    },
    onError: (e: any) => toast.error(getErrMsg(e, 'Failed to create town')),
  });
}

export function useUpdateTown() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ id: number }, any, { id: number } & Omit<AdminDeliveryTown, 'id'>>({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put<ApiEnvelope<{ id: number }>>(`/api/admin/delivery-towns/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Town updated');
      qc.invalidateQueries({ queryKey: DELIVERY_QK.towns() });
    },
    onError: (e: any) => toast.error(getErrMsg(e, 'Failed to update town')),
  });
}

export function useDeactivateTown() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ id: number }, any, { id: number }>({
    mutationFn: async ({ id }) => {
      const { data } = await api.patch<ApiEnvelope<{ id: number }>>(`/api/admin/delivery-towns/${id}/deactivate`);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Town deactivated');
      qc.invalidateQueries({ queryKey: DELIVERY_QK.towns() });
    },
    onError: (e: any) => toast.error(getErrMsg(e, 'Failed to deactivate town')),
  });
}
