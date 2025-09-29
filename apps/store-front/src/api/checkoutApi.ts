import { useMutation } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';

export type QuoteRequest = {
  shippingOptionId: number;
  couponCode?: string;
};

export type QuoteResponse = {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  coupon?: {
    code: string;
    valid: boolean;
    message?: string;
  } | null;
  shipping?: {
    id: number;
    name: string;
  } | null;
};

export function useCheckoutQuote() {
  return useMutation<QuoteResponse, any, QuoteRequest>({
    mutationKey: ['checkout-quote'],
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiEnvelope<QuoteResponse>>('/api/customer/checkout/quote', payload);
      return data.data as any;
    },
  });
}
