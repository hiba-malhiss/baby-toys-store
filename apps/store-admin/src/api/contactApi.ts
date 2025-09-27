import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type {
  ContactMessage,
  ContactMessageStatus,
  UseAdminContactMessagesParams,
} from './types/contact';
import { useToast } from '@baby-toys/ui-kit';

export const useAdminContactMessages = (params?: UseAdminContactMessagesParams) =>
  useQuery<Page<ContactMessage>>({
    queryKey: [
      'admin-contact-messages',
      Math.max(0, (params?.page ?? 1) - 1),
      params?.size ?? 10,
      params?.status ?? '',
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Page<ContactMessage>>>(
        '/api/admin/contact-messages',
        {
          params: {
            page: Math.max(0, (params?.page ?? 1) - 1),
            size: params?.size ?? 10,
            status: params?.status || undefined,
          },
        }
      );
      return data.data;
    },
  });

export const useGetContactMessage = (id?: number) =>
  useQuery<ContactMessage>({
    queryKey: ['admin-contact-message', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<ContactMessage>>(
        `/api/admin/contact-messages/${id}`
      );
      return data.data;
    },
    staleTime: 30_000,
  });

export const useUpdateContactStatus = () => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ContactMessageStatus }) => {
      const { data } = await api.patch<ApiEnvelope<ContactMessage>>(
        `/api/admin/contact-messages/${id}/status`,
        { status }
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success('Status updated');
      qc.invalidateQueries({ queryKey: ['admin-contact-messages'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update status'),
  });
};
