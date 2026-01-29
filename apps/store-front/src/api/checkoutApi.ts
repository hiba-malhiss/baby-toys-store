import { useMutation } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import { useAuth } from '../context/AuthContext';
import { hasGuestCartToken } from '../utils/guestCart.ts';

export type QuoteRequest = {
  townCode: string;
  couponCode?: string;
};

export type QuoteResponse = {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  isFreeShipping: boolean;
  coupon?: {
    code: string;
    valid: boolean;
    message?: string;
  } | null;
  townCode?: string | null;
  zoneCode?: string | null;
};

export function useCheckoutQuote() {
  const { isAuthenticated } = useAuth();

  return useMutation<QuoteResponse, any, QuoteRequest>({
    mutationKey: ['checkout-quote'],
    enabled: isAuthenticated || hasGuestCartToken(),
    mutationFn: async (payload) => {
      const endpoint = isAuthenticated
        ? '/api/customer/checkout/quote'
        : '/api/guest/checkout/quote';

      const { data } = await api.post<ApiEnvelope<QuoteResponse>>(endpoint, payload);
      return data.data as any;
    },
  });
}
