import { useQuery } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope } from './types/common';
import type { DashboardStatsResponse } from './types/dashboard';

export const DASHBOARD_QUERY_KEY = 'admin-dashboard';

export const useAdminDashboard = () =>
  useQuery<DashboardStatsResponse>({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<DashboardStatsResponse>>('/api/admin/dashboard');
      return data.data;
    },
    staleTime: 60_000,
  });
