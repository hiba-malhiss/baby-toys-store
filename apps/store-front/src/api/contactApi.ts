import api from './axiosConfig';
import { useMutation } from '@tanstack/react-query';

export interface CreateContactMessageRequest {
  name: string;
  email?: string;
  phoneNumber?: string;
  subject?: string;
  message: string;
}

export function useSendContactMessage() {
  return useMutation({
    mutationFn: async (payload: CreateContactMessageRequest) => {
      const { data } = await api.post('/api/contact-messages', payload);
      return data;
    },
  });
}
