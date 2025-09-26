export interface ReviewDto {
  id: number;
  productId?: number;
  userEmail?: string;
  userName?: string;
  rating: number;
  comment?: string;
  createdAt?: string;
}
