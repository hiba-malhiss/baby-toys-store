import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import type { TownAnalyticsRow } from './types/townAnalytics';

export const TOWN_ANALYTICS_QUERY_KEY = 'admin-town-analytics';

export function useTownAnalytics() {
  return useQuery<TownAnalyticsRow[]>({
    queryKey: [TOWN_ANALYTICS_QUERY_KEY],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<TownAnalyticsRow[]>>(
        '/api/admin/dashboard/town-analytics'
      );
      return data.data;
    },
    staleTime: 60_000,
  });
}
