import { useMutation } from '@tanstack/react-query';
import { useToast } from '@baby-toys/ui-kit';
import api from './axiosConfig';
import type { ImportSummary, ExportFilter } from './types/importExport';
import type { ApiEnvelope } from './types/common';

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

/**
 * Uploads an .xlsx file and returns the import summary.
 * No client-side validation — the server handles all checks.
 */
export const useImportProducts = () => {
  return useMutation<ImportSummary, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await api.post<ApiEnvelope<ImportSummary>>(
        '/api/admin/products/import',
        formData
      );

      return data.data;
    },
  });
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/**
 * Triggers an export and automatically downloads the .xlsx file.
 *
 * @param filter  'ALL' | 'ACTIVE_ONLY' | 'INACTIVE_ONLY'
 */
export const useExportProducts = () => {
  const toast = useToast();

  return useMutation<void, Error, ExportFilter>({
    mutationFn: async (filter: ExportFilter) => {
      const response = await api.get('/api/admin/products/export', {
        params: { filter },
        responseType: 'blob',
      });

      const filename = extractFilename(response.headers['content-disposition'])
        ?? `products-${filter.toLowerCase().replace('_', '-')}-${today()}.xlsx`;

      triggerDownload(response.data, filename);
    },
    onError: () => {
      toast.error('Export failed. Please try again.');
    },
  });
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractFilename(disposition?: string): string | null {
  if (!disposition) return null;
  const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  return match?.[1]?.replace(/['"]/g, '') ?? null;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url  = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href  = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
