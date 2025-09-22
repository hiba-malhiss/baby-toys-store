export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discountAmount?: number;
  discountPercent?: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  // Backend returns LocalDateTime as strings (e.g., '2025-09-22T12:34:00')
  validFrom: string;
  validUntil?: string;
  maxUses?: number;
  currentUses?: number;
  isActive?: boolean;
}

export interface CreateCouponRequest {
  code: string;
  description?: string;
  discountAmount?: number;
  discountPercent?: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  // LocalDateTime strings expected by backend
  validFrom: string;
  validUntil?: string;
  maxUses?: number;
  isActive?: boolean;
}

export interface UpdateCouponRequest {
  code?: string;
  description?: string;
  discountAmount?: number;
  discountPercent?: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  // LocalDateTime strings expected by backend
  validFrom?: string;
  validUntil?: string;
  maxUses?: number;
  isActive?: boolean;
}
