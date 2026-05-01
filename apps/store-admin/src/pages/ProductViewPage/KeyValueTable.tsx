import React, { useMemo } from 'react';
import { Table } from '@baby-toys/ui-kit';
import styles from './product-view-page.module.scss';

export type KeyValueRow = {
  id: string;
  label: React.ReactNode;
  value: React.ReactNode;
};

type Props = {
  rows: KeyValueRow[];
  labelHeader?: string;
};

const KeyValueTable: React.FC<Props> = ({ rows, labelHeader = 'Stat' }) => {
  const columns = useMemo(
    () => [
      {
        header: labelHeader,
        field: 'label',
        style: { minWidth: 0 },
        body: (row: KeyValueRow) => <span className={styles.statLabel}>{row.label}</span>,
      },
      {
        header: '',
        field: 'value',
        style: { textAlign: 'right' as const, width: 220 },
        body: (row: KeyValueRow) => <span className={styles.statValue}>{row.value ?? '-'}</span>,
      },
    ],
    [labelHeader]
  );

  if (!rows?.length) return null;

  return (
    <div className={styles.statsTableWrapper}>
      <Table
        value={rows}
        columns={columns as any}
        paginator={false}
        rowHover={false}
        stripedRows
        emptyMessage=""
        useLocalSortAndFilter={false}
      />
    </div>
  );
};

export default KeyValueTable;
