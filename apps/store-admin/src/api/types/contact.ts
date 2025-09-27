export type ContactMessageStatus = 'NEW' | 'READ' | 'REPLIED';

export interface ContactMessage {
  id: number;
  name: string;
  email?: string;
  phoneNumber?: string;
  subject?: string;
  message: string;
  status: ContactMessageStatus;
  createdAt?: string;
}

export interface UseAdminContactMessagesParams {
  page?: number;
  size?: number;
  status?: ContactMessageStatus | '';
}
