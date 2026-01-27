import React, { type ReactNode } from 'react';
import styles from './card.module.scss';
import clsx from 'clsx';
import Heading from '../Heading/Heading.tsx';

type CardProps = {
  children: ReactNode;
  header?: ReactNode;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  className?: string;
  fullWidth?: boolean;
  withoutBorder?: boolean;
};

const sizeClassMap: Record<string, string> = {
  xsmall: styles.cardXsmall,
  small: styles.cardSmall,
  medium: styles.cardMedium,
  large: styles.cardLarge,
};

const Card: React.FC<CardProps> = ({
  withoutBorder,
  fullWidth,
  children,
  className,
  header,
  size = 'medium',
}) => {
  return (
    <div
      className={clsx(
        fullWidth && styles.fullWidth,
        withoutBorder && styles.withoutBorder,
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
