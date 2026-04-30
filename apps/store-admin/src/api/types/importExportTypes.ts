// Types for the refactored import/export system

export type ExportFilter = 'ALL' | 'ACTIVE_ONLY' | 'INACTIVE_ONLY';

export type RowResultStatus = 'CREATED' | 'UPDATED' | 'FAILED';
export type RowResultSheet  = 'PRODUCTS' | 'VARIATIONS';

export interface RowResult {
  sheet:     RowResultSheet;
  rowNumber: number;
  status:    RowResultStatus;
  entityId?: number;
  reason?:   string;
}

export interface ImportSummary {
  // Products sheet
  productsCreated:  number;
  productsUpdated:  number;
  productsFailed:   number;

  // Variations sheet
  variationsCreated: number;
  variationsUpdated: number;
  variationsFailed:  number;

  // UX hint — how many new products need images before going live
  productsCreatedDisabled: number;

  // Failed rows for the error table
  failedRows: RowResult[];
}
