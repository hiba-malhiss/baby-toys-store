import React, { useMemo } from 'react';
import { Table } from '@baby-toys/ui-kit';
import styles from './product-view-page.module.scss';
import type { ProductOptionDto } from '../../api/types/product';

export type StatRow = { id: string; label: string; value: React.ReactNode };

const StatsTable: React.FC<{ rows: StatRow[] }> = ({ rows }) => {
  const columns = useMemo(
    () => [
      {
        header: 'Option',
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

const ProductOptionsTable: React.FC<{ options: ProductOptionDto[] }> = ({ options }) => {
  const rows: StatRow[] = (options || []).map((o) => ({
    id: String(o?.type?.id),
    label: o?.type?.name ?? 'Option',
    value: (Array.isArray(o?.values) ? o.values : [])
      .map((v: any) => v?.display ?? v?.value ?? v?.code ?? String(v?.id ?? ''))
      .filter(Boolean)
      .join(' · '),
  }));

  if (!rows.length) return null;
  return <StatsTable rows={rows} />;
};

export default ProductOptionsTable;
