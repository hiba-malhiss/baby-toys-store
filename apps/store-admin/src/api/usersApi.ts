import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { AdminUser, UseAdminUsersParams } from './types/user';

function toUpper(val?: string) {
  return val ? val.toUpperCase() : val;
}

export const useAdminUsers = (params?: UseAdminUsersParams) =>
  useQuery<Page<AdminUser>>({
    queryKey: [
      'admin-users',
      Math.max(0, (params?.page ?? 1) - 1),
      params?.size ?? 10,
      params?.sortBy ?? 'createdAt',
      toUpper(params?.sortDirection ?? 'DESC'),
      params?.query ?? '',
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Page<AdminUser>>>('/api/admin/users', {
        params: {
          page: Math.max(0, (params?.page ?? 1) - 1),
          size: params?.size ?? 10,
          sortBy: params?.sortBy ?? 'createdAt',
          sortDirection: toUpper(params?.sortDirection ?? 'DESC'),
          query: params?.query,
        },
      });
      return data.data;
    },
  });
