import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';

export type StoreSettingsGrouped = {
  general?: Record<string, string>;
  contact?: Record<string, string>;
  policies?: Record<string, string>;
};

export type StoreSettingUpdateItem = {
  section: 'GENERAL' | 'CONTACT' | 'POLICIES';
  key: string;
  value: string;
};

export const useStoreSettings = () =>
  useQuery<StoreSettingsGrouped>({
    queryKey: ['storeSettings'],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<StoreSettingsGrouped>>('/api/store-settings');
      return data.data || {};
    },
    staleTime: 60_000,
  });

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
    },
  });
};
