import React, { useRef, useState } from 'react';
import {
  Flex,
  Heading,
  Button,
  Card,
  Text,
  Select,
  Option,
  Chip,
  useToast,
} from '@baby-toys/ui-kit';
import { Upload, Download, AlertCircle, CheckCircle, Info } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useImportProducts, useExportProducts } from '../../api/productImportExportApi';
import type { ImportSummary, ExportFilter, RowResult } from '../../api/types/importExport';
import styles from './product-import-export-page.module.scss';

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProductImportExportPage() {
  const toast = useToast();

  const [importSummary, setImportSummary]     = useState<ImportSummary | null>(null);
  const [exportFilter, setExportFilter]       = useState<ExportFilter>('ALL');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useImportProducts();
  const exportMutation = useExportProducts();

  // -----------------------------------------------------------------------
  // Import
  // -----------------------------------------------------------------------

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset so the same file can be re-selected after a fix
    event.target.value = '';

    setImportSummary(null);

    try {
      const summary = await importMutation.mutateAsync(file);
      setImportSummary(summary);

      const hasFailures = summary.productsFailed > 0 || summary.variationsFailed > 0;
      if (hasFailures) {
        toast.warning('Import finished with some failures — see details below.');
      } else {
        toast.success('Import completed successfully!');
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Import failed. Check your file and try again.';
      toast.error(message);
    }
  }

  // -----------------------------------------------------------------------
  // Export
  // -----------------------------------------------------------------------

  async function handleExport() {
    try {
      await exportMutation.mutateAsync(exportFilter);
    } catch {
      // error toast is handled in the mutation
    }
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <AdminLayout>
      <Flex direction="column" gap={32} style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
        <Heading level="h2">Product Import / Export</Heading>

        {/* ---------------------------------------------------------------- */}
        {/* Import card                                                       */}
        {/* ---------------------------------------------------------------- */}
        <Card>
          <Flex direction="column" gap={16} padding={24}>
            <Flex direction="row" gap={8} align="center">
              <Upload size={20} />
              <Heading level="h4">Import from Excel</Heading>
            </Flex>

            <FormatNote />

            <Flex direction="row" gap={12} align="center">
              <Button
                variant="primary"
                onClick={openFilePicker}
                disabled={importMutation.isPending}
                loading={importMutation.isPending}
              >
                {importMutation.isPending ? 'Importing…' : 'Upload .xlsx file'}
              </Button>

              <Text size="sm" color="secondary">
                Only .xlsx files are accepted.
              </Text>
            </Flex>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              style={{ display: 'none' }}
              onChange={handleFileSelected}
            />

            {/* Import results */}
            {importSummary && <ImportResults summary={importSummary} />}
          </Flex>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* Export card                                                       */}
        {/* ---------------------------------------------------------------- */}
        <Card>
          <Flex direction="column" gap={16} padding={24}>
            <Flex direction="row" gap={8} align="center">
              <Download size={20} />
              <Heading level="h4">Export to Excel</Heading>
            </Flex>

            <Text size="sm" color="secondary">
              Exports two sheets: Products and Product Variations. You can re-import
              the file after editing.
            </Text>

            <Flex direction="row" gap={12} align="center" wrap>
              <Flex direction="column" gap={4} style={{ minWidth: 200 }}>
                <Text size="sm" weight="medium">Which products to export?</Text>
                <Select
                  value={exportFilter}
                  onChange={(v) => setExportFilter(v as ExportFilter)}
                >
                  <Option value="ALL">All products</Option>
                  <Option value="ACTIVE_ONLY">Active products only</Option>
                  <Option value="INACTIVE_ONLY">Inactive products only</Option>
                </Select>
              </Flex>

              <Button
                variant="secondary"
                onClick={handleExport}
                disabled={exportMutation.isPending}
                loading={exportMutation.isPending}
                style={{ alignSelf: 'flex-end' }}
              >
                {exportMutation.isPending ? 'Preparing download…' : 'Download Excel'}
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </AdminLayout>
  );
}

// ---------------------------------------------------------------------------
// FormatNote — explains what the two sheets look like
// ---------------------------------------------------------------------------

function FormatNote() {
  return (
    <Flex
      direction="row"
      gap={10}
      align="flex-start"
      style={{
        background: 'var(--color-info-subtle)',
        border: '1px solid var(--color-info-border)',
        borderRadius: 8,
        padding: '12px 14px',
      }}
    >
      <Info size={16} style={{ color: 'var(--color-info)', flexShrink: 0, marginTop: 2 }} />
      <Flex direction="column" gap={6}>
        <Text size="sm" weight="medium">Expected file format</Text>
        <Text size="sm" color="secondary">
          Your file must have two sheets:
        </Text>
        <Text size="sm" color="secondary">
          <strong>Sheet 1 — Products:</strong> id, name_en, name_ar, description_en,
          description_ar, short_description_en, short_description_ar, status
        </Text>
        <Text size="sm" color="secondary">
          <strong>Sheet 2 — Product Variations:</strong> id, product_id, sku, price,
          old_price, stock_quantity, status
        </Text>
        <Text size="sm" color="secondary">
          Leave the <strong>id</strong> column blank to create a new record.
          Fill it in to update an existing one.
        </Text>
      </Flex>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// ImportResults — shows the summary after a completed import
// ---------------------------------------------------------------------------

function ImportResults({ summary }: { summary: ImportSummary }) {
  const hasFailures = summary.productsFailed > 0 || summary.variationsFailed > 0;
  const allPassed   = !hasFailures;

  return (
    <Flex direction="column" gap={16} style={{ marginTop: 8 }}>
      {/* Status banner */}
      <Flex
        direction="row"
        gap={10}
        align="center"
        style={{
          padding: '10px 14px',
          borderRadius: 8,
          background: allPassed ? 'var(--color-success-subtle)' : 'var(--color-warning-subtle)',
          border: `1px solid ${allPassed ? 'var(--color-success-border)' : 'var(--color-warning-border)'}`,
        }}
      >
        {allPassed
          ? <CheckCircle size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
          : <AlertCircle size={16} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
        }
        <Text size="sm" weight="medium">
          {allPassed ? 'All rows imported successfully.' : 'Import completed with some failures.'}
        </Text>
      </Flex>

      {/* Counts */}
      <Flex direction="row" gap={24} wrap>
        <CountGroup
          label="Products"
          created={summary.productsCreated}
          updated={summary.productsUpdated}
          failed={summary.productsFailed}
        />
        <CountGroup
          label="Variations"
          created={summary.variationsCreated}
          updated={summary.variationsUpdated}
          failed={summary.variationsFailed}
        />
      </Flex>

      {/* Disabled products notice */}
      {summary.productsCreatedDisabled > 0 && (
        <Flex
          direction="row"
          gap={10}
          align="flex-start"
          style={{
            background: 'var(--color-warning-subtle)',
            border: '1px solid var(--color-warning-border)',
            borderRadius: 8,
            padding: '12px 14px',
          }}
        >
          <AlertCircle size={16} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: 2 }} />
          <Text size="sm">
            <strong>{summary.productsCreatedDisabled} new product(s)</strong> were created as{' '}
            <strong>disabled</strong>. Please upload at least one image for each and then enable them.
          </Text>
        </Flex>
      )}

      {/* Failed rows table */}
      {summary.failedRows.length > 0 && (
        <FailedRowsTable rows={summary.failedRows} />
      )}
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// CountGroup — created/updated/failed pill row per sheet
// ---------------------------------------------------------------------------

function CountGroup({
  label,
  created,
  updated,
  failed,
}: {
  label: string;
  created: number;
  updated: number;
  failed: number;
}) {
  return (
    <Flex direction="column" gap={6}>
      <Text size="sm" weight="medium" color="secondary">{label}</Text>
      <Flex direction="row" gap={8}>
        {created > 0 && <Chip color="success">{created} created</Chip>}
        {updated > 0 && <Chip color="info">{updated} updated</Chip>}
        {failed  > 0 && <Chip color="error">{failed} failed</Chip>}
        {created === 0 && updated === 0 && failed === 0 && (
          <Text size="sm" color="secondary">No rows</Text>
        )}
      </Flex>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// FailedRowsTable — lists each failed row with its reason
// ---------------------------------------------------------------------------

function FailedRowsTable({ rows }: { rows: RowResult[] }) {
  return (
    <Flex direction="column" gap={8}>
      <Text size="sm" weight="medium" color="error">
        Failed rows ({rows.length})
      </Text>
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.failedTable}>
          <thead>
            <tr>
              <th>Sheet</th>
              <th>Row</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{row.sheet === 'PRODUCTS' ? 'Products' : 'Variations'}</td>
                <td>{row.rowNumber}</td>
                <td>{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Flex>
  );
}
