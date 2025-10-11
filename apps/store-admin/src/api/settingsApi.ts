import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import { getAppLocale } from "../components/i18n/locale.ts";
import { useMemo } from "react";

export type StoreSettingsGrouped = {
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
  section: 'GENERAL' | 'CONTACT' | 'POLICIES';
  key: string;
  value: string;
  locale?: string;
};

export const useAdminStoreSettingsMap = () =>
  useQuery<Record<string, StoreSettingsGrouped>>({
    queryKey: ['storeSettings', 'map'],
    queryFn: async() => {
      const { data } = await api.get<ApiEnvelope<Record<string, StoreSettingsGrouped>>>(
        '/api/admin/store-settings'
      );
      return data.data || {};
    },
    staleTime: 60_000,
  });

export const useStoreSettings = () => {
  const { data } = useAdminStoreSettingsMap();
  const dataLocal = useMemo(() => {
    return data?.[getAppLocale() || 'en'] || {}
  }, [data])
  return { data: dataLocal };
};

export const useUpsertStoreSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async(items: StoreSettingUpdateItem[]) => {
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
