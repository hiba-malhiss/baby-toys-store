import React from 'react';
import styles from './skeleton-card.module.scss';

const SkeletonCard: React.FC = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonImage} />
    <div className={styles.skeletonLine} style={{ width: '70%' }} />
    <div className={styles.skeletonLine} style={{ width: '50%' }} />
    <div className={styles.skeletonLine} style={{ width: '40%' }} />
  </div>
);

export default SkeletonCard;
