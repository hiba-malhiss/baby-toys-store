import React from 'react';
import clsx from 'clsx';
import styles from './price-display.module.scss';

export interface PriceDisplayProps {
  price: number | string;
  oldPrice?: number | string | null;
  formatCurrency?: (amount: number) => string;
  className?: string;
}

const toNumber = (v: number | string | null | undefined): number | null => {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return v;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  oldPrice,
  formatCurrency,
  className,
}) => {
  const priceNum = toNumber(price);
  const oldNum = toNumber(oldPrice);

  return (
    <div className={clsx(className, !!oldNum && styles.priceDisplayHasOld, styles.priceDisplayPrice)}>
      <span className={styles.priceDisplayPriceNew}>
        {formatCurrency ? formatCurrency(priceNum ?? 0) : (priceNum ?? 0)}
      </span>
      {oldNum !== null && oldNum !== undefined && (
        <span className={styles.priceDisplayPriceOld}>
          {formatCurrency ? formatCurrency(oldNum ?? 0) : (oldNum ?? 0)}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
