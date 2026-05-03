import React from 'react';
import styles from './chip.module.scss';
import clsx from 'clsx';
import Button from '../Button/Button.tsx';
import { X } from 'lucide-react';

export type ChipAppearance =
  | 'primary'
  | 'secondary'
  | 'secondary-outline'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'error';

type ChipProps = {
  label: string;
  appearance?: ChipAppearance;
  className?: string;
  size?: 'small';
  onClose?: () => void;
};

const Chip: React.FC<ChipProps> = ({
  size,
  onClose,
  label,
  appearance = 'secondary',
  className,
}) => {
  return (
    <span
      className={clsx(
        styles.chip,
        styles[`chip--${appearance}`],
        size && styles[`chip--smallSize`],
        className,
        onClose && styles.hasClose
      )}
    >
      <span>{label}</span>
      {onClose && (
        <Button withoutPadding leftIconComp={X} appearance="link" size="xsmall" onClick={onClose} />
      )}
    </span>
  );
};

export default Chip;
