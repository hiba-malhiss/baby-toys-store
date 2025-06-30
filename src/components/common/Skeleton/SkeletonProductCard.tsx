import React from 'react';
import clsx from 'clsx';
import styles from './skeleton-product-card.module.scss';

type Direction = 'vertical' | 'horizontal';

interface SkeletonProductCardProps {
  direction?: Direction;
}

const SkeletonProductCard: React.FC<SkeletonProductCardProps> = ({ direction = 'vertical' }) => {
  return (
    <div
      className={clsx(
        styles.skeletonProductCard,
        direction === 'horizontal' && styles.skeletonProductCardHorizontal
      )}
    >
      <div className={styles.skeletonProductCardCardBox}>
        <div className={styles.skeletonProductCardChip} />
        <div className={styles.skeletonProductCardImageWrapper}>
          <div className={styles.skeletonProductCardImage} />
        </div>
      </div>
      <div className={styles.skeletonProductCardInfo}>
        <div className={styles.skeletonProductCardName} />
        <div className={styles.skeletonProductCardPriceRow}>
          <div className={styles.skeletonProductCardPriceNew} />
          <div className={styles.skeletonProductCardPriceOld} />
        </div>
        <div className={styles.skeletonProductCardRating} />
      </div>
    </div>
  );
};

export default SkeletonProductCard;
