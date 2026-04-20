import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import { getAppLocale } from './../i18n/locale.ts';
import { useMemo } from 'react';

export type StoreSettingsGrouped = {
  freeShippingValid: boolean;
  general: {
    currency: string;
    currencySymbol: string;
    timezone: string;
    priceRangeMin?: string | number | null;
    priceRangeMax?: string | number | null;
  };
  contact: {
    workDays: string;
    workTimes: string;
    phone: string;
    email: string;
    address: string;
  };
  policies: {
    cancelPolicy?: string | null;
    returnPolicy?: string | null;
    shippingPolicy?: string | null;
    freeShippingMinSubtotal?: number | null;
    freeShippingStartAt?: string | null;
    freeShippingEndAt?: string | null;
  };
};

export type StoreSettingUpdateItem = {
  section: 'GENERAL' | 'CONTACT' | 'POLICIES' | 'THEME';
  key: string;
  value: string;
  locale?: string;
};

export type ThemeSettings = {
  primaryColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  footerImageUrl?: string;
  logoUrl?: string;
};

export const useUploadLogo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<ApiEnvelope<{ url: string }>>(
        '/api/admin/store-settings/logo',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data.data.url;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storeSettings', 'theme'] });
    },
  });
};

export const useDeleteLogo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fileUrl: string) => {
      await api.delete('/api/admin/store-settings/logo', { params: { fileUrl } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storeSettings', 'theme'] });
    },
  });
};

export const useAdminStoreSettingsMap = () =>
  useQuery<Record<string, StoreSettingsGrouped>>({
    queryKey: ['storeSettings', 'map'],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Record<string, StoreSettingsGrouped>>>(
        '/api/admin/store-settings'
      );
      return data.data;
    },
    staleTime: 60_000,
  });

export const useStoreSettings = () => {
  const { data } = useAdminStoreSettingsMap();
  const locale = getAppLocale() || 'en';
  const dataLocal = useMemo<StoreSettingsGrouped | undefined>(() => {
    return data?.[locale];
  }, [data, locale]);
  return { data: dataLocal };
};

export const useUpsertStoreSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: StoreSettingUpdateItem[]) => {
      const { data } = await api.put<ApiEnvelope<{ updated: number }>>(
        '/api/admin/store-settings',
        items
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storeSettings'] });
      qc.invalidateQueries({ queryKey: ['storeSettings', 'map'] });
    },
  });
};

export const useThemeSettings = () =>
  useQuery<ThemeSettings>({
    queryKey: ['storeSettings', 'theme'],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<ThemeSettings>>('/api/admin/store-settings/theme');
      return data.data ?? {};
    },
    staleTime: 60_000,
  });
