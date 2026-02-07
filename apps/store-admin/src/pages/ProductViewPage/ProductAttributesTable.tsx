import React, { useMemo } from 'react';
import { Table } from '@baby-toys/ui-kit';
import styles from './product-view-page.module.scss';

export type StatRow = { id: string; label: string; value: React.ReactNode };

const StatsTable: React.FC<{ rows: StatRow[] }> = ({ rows }) => {
  const columns = useMemo(
    () => [
      {
        header: 'Attribute',
        field: 'label',
        style: { minWidth: 0 },
        body: (row: StatRow) => <span className={styles.statLabel}>{row.label}</span>,
      },
      {
        header: '',
        field: 'value',
        style: { textAlign: 'right' as const, width: 220 },
        body: (row: StatRow) => <span className={styles.statValue}>{row.value ?? '-'}</span>,
      },
    ],
    []
  );

  return (
    <div className={styles.statsTableWrapper}>
      <Table
        value={rows}
        columns={columns as any}
        paginator={false}
        rowHover={false}
        stripedRows
        title={undefined}
        emptyMessage=""
        useLocalSortAndFilter={false}
        withoutCard
      />
    </div>
  );
};

const ProductAttributesTable: React.FC<{ attributes: any[] | undefined }> = ({ attributes }) => {
  const rows: StatRow[] = (Array.isArray(attributes) ? attributes : []).map((a: any) => ({
    id: String(a?.type?.id ?? a?.attributeTypeId ?? Math.random()),
    label: a?.type?.name ?? a?.displayName ?? a?.code ?? 'Attribute',
    value: (Array.isArray(a?.values) ? a.values : Array.isArray(a?.valueIds) ? a.valueIds : [])
      .map((v: any) => {
        const id = typeof v === 'number' ? v : v?.id;
        const disp = v?.translations?.find?.(
          (x: any) => (x?.locale || '').toLowerCase() === 'en'
        )?.displayValue;
        return disp ?? v?.display ?? v?.value ?? v?.code ?? String(id ?? '');
      })
      .filter(Boolean)
      .join(' · '),
  }));

  if (!rows.length) return null;
  return <StatsTable rows={rows} />;
};

export default ProductAttributesTable;
