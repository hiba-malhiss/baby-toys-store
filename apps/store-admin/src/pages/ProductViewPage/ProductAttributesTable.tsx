import React, { useMemo } from 'react';
import KeyValueTable, { type KeyValueRow } from './KeyValueTable';

const ProductAttributesTable: React.FC<{ attributes: any[] | undefined }> = ({ attributes }) => {
  const rows: KeyValueRow[] = useMemo(() => {
    const src = Array.isArray(attributes) ? attributes : [];

    return src.map((a: any) => {
      const valuesSrc = Array.isArray(a?.values)
        ? a.values
        : Array.isArray(a?.valueIds)
          ? a.valueIds
          : [];

      const values = valuesSrc
        .map((v: any) => {
          const id = typeof v === 'number' ? v : v?.id;
          const disp = v?.translations?.find?.(
            (x: any) => (x?.locale || '').toLowerCase() === 'en'
          )?.displayValue;

          return disp ?? v?.display ?? v?.value ?? v?.code ?? String(id ?? '');
        })
        .filter(Boolean)
        .join(' · ');

      return {
        id: String(a?.type?.id ?? a?.attributeTypeId ?? Math.random()),
        label: a?.type?.name ?? a?.displayName ?? a?.code ?? 'Attribute',
        value: values || '-',
      };
    });
  }, [attributes]);

  return <KeyValueTable rows={rows} labelHeader="Attribute" />;
};

export default ProductAttributesTable;
