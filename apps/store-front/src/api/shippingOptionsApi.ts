import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import { useToast } from '@baby-toys/ui-kit';

export type ShippingOption = {
  id: number;
  name: string;
  description?: string;
  cost: number;
  active: boolean;
};

export const SHIPPING_OPTIONS_KEYS = {
  active: 'shippingOptions-active',
} as const;

export function useActiveShippingOptions() {
  const toast = useToast();
  return useQuery<ShippingOption[]>({
    queryKey: [SHIPPING_OPTIONS_KEYS.active],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<ShippingOption[]>>('/api/shipping-options');
      return res.data.data || [];
    },
    staleTime: 60_000,
    onError: (e: any) => toast.error(e?.message || 'Failed to load shipping options'),
  });
}
