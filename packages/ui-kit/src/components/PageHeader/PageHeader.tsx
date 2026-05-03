import React from 'react';
import styles from './page-header.module.scss';
import clsx from 'clsx';

export interface PageHeaderProps {
  /** Left side: title/heading content */
  left: React.ReactNode;
  /** Right side: action buttons */
  right?: React.ReactNode;
  className?: string;
}

/**
 * Consistent admin page header layout — title on left, actions on right.
 * Shared by Products, Orders, Categories, Attributes, Options, etc.
 */
const PageHeader: React.FC<PageHeaderProps> = ({ left, right, className }) => {
  return (
    <div className={clsx(styles.pageHeader, className)}>
      <div className={styles.left}>{left}</div>
      {right && <div className={styles.right}>{right}</div>}
    </div>
  );
};

export default PageHeader;
