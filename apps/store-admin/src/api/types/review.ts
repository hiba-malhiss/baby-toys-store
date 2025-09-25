export enum ReviewStatus {
  PUBLISHED = 'PUBLISHED',
  HIDDEN = 'HIDDEN',
}

export interface ReviewDto {
  id: number;
  productId: number | null;
  userId: number | null;
  rating: number;
  comment?: string | null;
  verifiedPurchase?: boolean;
  createdAt: string;
  isEditable?: boolean;
  status?: ReviewStatus | string;
  productName?: string | null;
  userEmail?: string | null;
}

export interface UseAdminReviewsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  productId?: number;
  userId?: number;
  rating?: number;
  status?: ReviewStatus;
}
