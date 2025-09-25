export interface AdminUser {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  role?: string;
}

export interface UseAdminUsersParams {
  query?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}
