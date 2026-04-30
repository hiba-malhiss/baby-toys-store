import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useImportProducts, useExportProducts } from '../../api/productImportApi';
import type {
  PreviewProductRow,
  ImportSummaryResponse,
  ImportRowResult,
} from '../../api/types/productImport';

type ImportStep = 'idle' | 'preview' | 'importing' | 'done' | 'error';

const EXCEL_COLUMNS = [
  'id',
  'product_sku',
  'name_en',
  'name_ar',
  'description_en',
  'description_ar',
  'short_description_en',
  'short_description_ar',
  'price',
  'stock_quantity',
  'category_id',
  'is_active',
  'release_date',
  'main_image',
] as const;

export const useProductImport = () => {
  const [step, setStep] = useState<ImportStep>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewProductRow[]>([]);
  const [summary, setSummary] = useState<ImportSummaryResponse | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const importMutation = useImportProducts();
  const exportMutation = useExportProducts();

  /**
   * Parse the xlsx file client-side for PREVIEW display only.
   * This does NOT validate — it just reads raw cell values as strings.
   */
  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setParseError(null);
    setSummary(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', raw: true });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          setParseError('Excel file has no sheets.');
          return;
        }
        const sheet = workbook.Sheets[sheetName];
        const jsonRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
          defval: '',
          raw: false,
        });

        const mapped: PreviewProductRow[] = jsonRows.map((row, idx) => {
          const normalized: PreviewProductRow = { _rowIndex: idx + 2 };
          for (const col of EXCEL_COLUMNS) {
            const matchKey = Object.keys(row).find(
              (k) => k.trim().toLowerCase() === col.toLowerCase()
            );
            normalized[col] = matchKey ? String(row[matchKey] ?? '') : '';
          }
          for (const key of Object.keys(row)) {
            const lower = key.trim().toLowerCase();
            if (!EXCEL_COLUMNS.includes(lower as (typeof EXCEL_COLUMNS)[number])) {
              normalized[key] = row[key];
            }
          }
          return normalized;
        });

        setPreviewRows(mapped);
        setStep('preview');
      } catch {
        setParseError('Could not read the Excel file. Ensure it is a valid .xlsx file.');
        setStep('error');
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  }, []);

  const handleImport = useCallback(async () => {
    if (!file) return;
    setStep('importing');
    try {
      const result = await importMutation.mutateAsync(file);
      setSummary(result);
      setStep('done');
    } catch {
      setStep('error');
    }
  }, [file, importMutation]);

  const handleExport = useCallback(() => {
    exportMutation.mutate();
  }, [exportMutation]);

  const handleReset = useCallback(() => {
    setStep('idle');
    setFile(null);
    setPreviewRows([]);
    setSummary(null);
    setParseError(null);
  }, []);

  const handleEditCell = useCallback((rowIndex: number, col: string, value: string) => {
    setPreviewRows((prev) =>
      prev.map((row) => (row._rowIndex === rowIndex ? { ...row, [col]: value } : row))
    );
  }, []);

  const getRowResult = useCallback(
    (rowIndex: number): ImportRowResult | undefined => {
      return summary?.rowResults.find((r) => r.rowNumber === rowIndex);
    },
    [summary]
  );

  return {
    step,
    file,
    previewRows,
    summary,
    parseError,
    isImporting: importMutation.isPending,
    isExporting: exportMutation.isPending,
    handleFileSelect,
    handleImport,
    handleExport,
    handleReset,
    handleEditCell,
    getRowResult,
    EXCEL_COLUMNS,
  };
};
