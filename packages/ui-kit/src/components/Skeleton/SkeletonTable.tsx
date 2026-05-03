import React from 'react';
import styles from './skeleton-table.module.scss';

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

/**
 * Skeleton loader for table pages — shown while data is loading.
 * Matches the approximate shape of a Table component.
 */
const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className={styles.wrapper}>
      {/* Header row */}
      <div className={styles.headerRow}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className={styles.headerCell} />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className={styles.row}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={styles.cell}
              style={{ width: `${60 + ((rowIdx * 7 + colIdx * 13) % 30)}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonTable;
