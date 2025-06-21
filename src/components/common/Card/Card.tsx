import React, { type ReactNode } from 'react';
import styles from './card.module.scss';
import clsx from 'clsx';
import Heading from '../Heading/Heading.tsx';

type CardProps = {
  children: ReactNode;
  header?: ReactNode;
  size?: 'small' | 'medium';
  className?: string;
  fullWidth?: boolean;
};

const sizeClassMap: Record<string, string> = {
  small: styles.cardSmall,
  medium: styles.cardMedium,
};

const Card: React.FC<CardProps> = ({ fullWidth, children, className, header, size = 'medium' }) => {
  return (
    <div
      className={clsx(
        fullWidth && styles.fullWidth,
        styles.card,
        className,
        size && sizeClassMap[size]
      )}
    >
      {header && (
        <Heading level="h2" className={styles.cardHeader}>
          {header}
        </Heading>
      )}
      {children}
    </div>
  );
};

export default Card;
