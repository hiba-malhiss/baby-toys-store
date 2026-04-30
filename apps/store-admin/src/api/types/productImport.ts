/**
 * Types for the Excel product import system.
 * These mirror the backend DTOs exactly.
 */

export interface RowValidationError {
  rowNumber: number;
  field: string;
  reason: string;
  rejectedValue?: unknown;
}

export type ImportRowStatus = 'CREATED' | 'UPDATED' | 'FAILED' | 'SKIPPED';

export interface ImportRowResult {
  rowNumber: number;
  status: ImportRowStatus;
  productId?: number | null;
  errors?: RowValidationError[] | null;
  reason?: string | null;
}

export interface ImportSummaryResponse {
  totalRows: number;
  createdCount: number;
  updatedCount: number;
  failedCount: number;
  skippedCount: number;
  /** Only failed/skipped rows are included to keep payload lean */
  rowResults: ImportRowResult[];
}

/**
 * Preview row: frontend parses the xlsx client-side for preview only.
 * No business logic runs here.
 */
export interface PreviewProductRow {
  _rowIndex: number; // 1-based, matches backend row numbers
  id?: string;
  product_sku?: string;
  name_en?: string;
  name_ar?: string;
  description_en?: string;
  description_ar?: string;
  short_description_en?: string;
  short_description_ar?: string;
  price?: string;
  stock_quantity?: string;
  category_id?: string;
  is_active?: string;
  release_date?: string;
  main_image?: string;
  [key: string]: unknown;
}
