import React from 'react';
import styles from './funnel-bars.module.scss';

export type FunnelItem = { label: string; value: number };

export default function FunnelBars({ items }: { items: FunnelItem[] }) {
  const safeItems = Array.isArray(items) ? items : [];
  const max = Math.max(...safeItems.map((i) => Number.isFinite(i.value) ? i.value : 0), 1);

  return (
    <div className={styles.wrap}>
      {safeItems.map((it) => {
        const val = Number.isFinite(it.value) ? it.value : 0;
        const widthPct = Math.round((val / max) * 100);
        return (
          <div key={it.label} className={styles.row}>
            <div className={styles.label}>{it.label}</div>

            <div className={styles.barTrack}>
              <div className={styles.bar} style={{ width: `${widthPct}%` }} />
            </div>

            <div className={styles.value}>{val.toFixed(1)}%</div>
          </div>
        );
      })}
    </div>
  );
}
