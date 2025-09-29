import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import { useToast } from '@baby-toys/ui-kit';
import { CART_KEYS } from './cartApi';

export const ORDER_KEYS = {
  myAddresses: 'myAddresses',
  placeOrder: 'placeOrder',
  validateCoupon: 'validateCoupon',
} as const;

export type AddressDTO = {
  id: number;
  firstName: string;
  lastName: string;
  town: string;
  region: string;
  detailedAddress: string;
  phoneNumber: string;
};

export type CreateOrderRequest = {
  shippingAddress: {
    firstName: string;
    lastName: string;
    town: string;
    region: string;
    detailedAddress: string;
    phoneNumber: string;
  };
  saveAddress?: boolean;
  couponCode?: string | null;
  shippingOptionId?: number | null;
};

export function useMyAddresses() {
  const toast = useToast();
  return useQuery<AddressDTO[]>({
    queryKey: [ORDER_KEYS.myAddresses],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<AddressDTO[]>>('/api/customer/addresses');
      return res.data.data;
    },
    onError: (err: any) => {
      const msg = err?.message || 'Failed to load addresses';
      toast.error(msg);
    },
    staleTime: 60_000,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<{ id: number }, any, CreateOrderRequest>({
    mutationKey: [ORDER_KEYS.placeOrder],
    mutationFn: async (payload) => {
      const res = await api.post<ApiEnvelope<{ id: number }>>('/api/customer/orders', payload);
      return res.data.data;
    },
    onSuccess: () => {
      // Refresh cart after successful order (server clears cart in service)
      qc.invalidateQueries({ queryKey: [CART_KEYS.cart] });
      qc.invalidateQueries({ queryKey: [CART_KEYS.cartCount] });
      toast.success('Order placed successfully');
    },
    onError: (err: any) => {
      const msg = err?.message || 'Failed to place order';
      toast.error(msg);
    },
  });
}
