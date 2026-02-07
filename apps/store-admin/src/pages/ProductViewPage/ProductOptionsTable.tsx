import React, { useMemo } from 'react';
import type { ProductOptionDto } from '../../api/types/product';
import KeyValueTable, { type KeyValueRow } from './KeyValueTable';

const ProductOptionsTable: React.FC<{ options: ProductOptionDto[] }> = ({ options }) => {
  const rows: KeyValueRow[] = useMemo(() => {
    return (options || []).map((o) => {
      const values = (Array.isArray(o?.values) ? o.values : [])
        .map((v: any) => v?.display ?? v?.value ?? v?.code ?? String(v?.id ?? ''))
        .filter(Boolean)
        .join(' · ');

      return {
        id: String(o?.type?.id ?? o?.id ?? Math.random()),
        label: o?.type?.name ?? 'Option',
        value: values || '-',
      };
    });
  }, [options]);

  return <KeyValueTable rows={rows} labelHeader="Option" />;
};

export default ProductOptionsTable;
