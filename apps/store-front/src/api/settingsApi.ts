import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';

export type StoreSettings = {
  freeShippingValid: boolean;
  general: {
    currency: string;
    currencySymbol: string;
    timezone: string;
    priceRangeMin: string;
    priceRangeMax: string;
  };
  contact: {
    workDays: string;
    workTimes: string;
    phone: string;
    email: string;
    address: string;
  };
  policies: {
    cancelPolicy: string;
    returnPolicy: string;
    shippingPolicy: string;
    freeShippingMinSubtotal: number;
    freeShippingStartAt: string;
    freeShippingEndAt: string;
  };
};

export type ThemeSettings = {
  primaryColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  footerImageUrl?: string;
  logoUrl?: string;
  translationEnabled?: boolean;
};

export const useStoreSettings = () =>
  useQuery<StoreSettings>({
    queryKey: ['storeFront', 'storeSettings'],
    queryFn: async () => {
      const { data } = await api.get<{ data: StoreSettings }>(`/api/store-settings`);
      return data.data as StoreSettings;
    },
    staleTime: 60_000,
  });

export const useStoreFrontThemeSettings = () =>
  useQuery<ThemeSettings>({
    queryKey: ['storeFront', 'themeSettings'],
    queryFn: async () => {
      const { data } = await api.get<{ data: ThemeSettings }>(`/api/store-settings/theme`);
      return data.data ?? {};
    },
    staleTime: 60_000,
  });
