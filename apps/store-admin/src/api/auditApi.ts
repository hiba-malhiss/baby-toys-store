import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';

export type AdminAuditLog = {
  id: number;
  action: string;
  entity: string;
  entityId: string;
  adminUserId: number | null;
  timestamp: string;
  success: boolean;
  errorMessage?: string | null;
  ip?: string | null;
  path?: string | null;
};

export type AdminAuditLogDetail = AdminAuditLog & {
  beforeJson?: string | null;
  afterJson?: string | null;
};

export interface UseAdminAuditLogsParams {
  page?: number; // 1-based page for UI
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC' | 'asc' | 'desc';
  entityId?: string;
}

function toUpper(val?: string) { return val ? val.toUpperCase() : val; }

export const useAdminAuditLogs = (params?: UseAdminAuditLogsParams) =>
  useQuery<Page<AdminAuditLog>>({
    queryKey: [
      'admin-audit-logs',
      Math.max(0, (params?.page ?? 1) - 1),
      params?.size ?? 20,
      params?.sortBy ?? 'timestamp',
      toUpper(params?.sortDirection ?? 'DESC'),
      params?.entityId ?? '',
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Page<AdminAuditLog>>>('/api/admin/audit-logs', {
        params: {
          page: Math.max(0, (params?.page ?? 1) - 1),
          size: params?.size ?? 20,
          sortBy: params?.sortBy ?? 'timestamp',
          sortDirection: toUpper(params?.sortDirection ?? 'DESC'),
          entityId: params?.entityId || undefined,
        },
      });
      return data.data;
    },
  });

export const useAdminAuditLog = (id?: number) =>
  useQuery<AdminAuditLogDetail>({
    queryKey: ['admin-audit-log', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<AdminAuditLogDetail>>(`/api/admin/audit-logs/${id}`);
      return data.data;
    },
  });
