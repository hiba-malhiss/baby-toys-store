import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';

export type StoreSettingsGrouped = {
  general?: Record<string, string>;
  contact?: Record<string, string>;
  policies?: Record<string, string>;
};

export const useStoreSettings = () =>
  useQuery<StoreSettingsGrouped>({
    queryKey: ['storeFront', 'storeSettings'],
    queryFn: async () => {
      const { data } = await api.get<{ data: StoreSettingsGrouped }>(
        '/api/store-settings'
      );
      return data.data || {};
    },
    staleTime: 60_000,
  });
