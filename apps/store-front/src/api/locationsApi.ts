import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import { useToast } from '@baby-toys/ui-kit';

export type DeliveryTownTranslationDTO = {
  locale: string;
  displayName: string;
};

export type DeliveryTown = {
  id: number;
  code: string;
  displayName?: string;
  zoneDisplayName?: string;
  translations: DeliveryTownTranslationDTO[];
  zoneCode?: string;
  feeOverride?: number;
  active: boolean;
};

export const LOCATIONS_KEYS = {
  towns: 'locations-towns',
} as const;

export function useActiveTowns(zoneCode?: string) {
  const toast = useToast();
  return useQuery<DeliveryTown[]>({
    queryKey: [LOCATIONS_KEYS.towns, zoneCode || 'all'],
    queryFn: async () => {
      const params = zoneCode ? { zoneCode } : undefined;
      const res = await api.get<ApiEnvelope<DeliveryTown[]>>('/api/locations/towns', { params });
      return res.data.data || [];
    },
    staleTime: 60_000,
    onError: (e: any) => toast.error(e?.message || 'Failed to load towns'),
  });
}
