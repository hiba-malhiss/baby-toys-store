import React from 'react';
import styles from './chip.module.scss';
import clsx from 'clsx';
import Button from '../Button/Button.tsx';
import { X } from 'lucide-react';

type ChipProps = {
  label: string;
  appearance?:
    | 'primary'
    | 'secondary-outline'
    | 'success'
    | 'warning'
    | 'info'
    | 'danger'
    | 'secondary';
  className?: string;
  size?: 'small';
  onClose?: () => void;
};

const Chip: React.FC<ChipProps> = ({ size, onClose, label, appearance = 'primary', className }) => {
  return (
    <span
      className={clsx(
        styles.chip,
        styles[`chip--${appearance}`],
        size && styles[`chip--${size}Size`],
        className,
        onClose && styles.hasClose
      )}
    >
      <span>{label}</span>
      {onClose && (
        <Button
          withoutPadding
          leftIconComp={X}
          appearance="link"
          size="xsmall"
          onClick={onClose}
        />
      )}
    </span>
  );
};

export default Chip;
