import React from 'react';
import styles from './chip.module.scss';
import clsx from 'clsx';
import Button from '../Button/Button.tsx';
import { faClose } from '@fortawesome/free-solid-svg-icons';

type ChipProps = {
  label: string;
  appearance?: 'primary' | 'secondary-outline' | 'success';
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
        styles[`chip--${size}Size`],
        className,
        onClose && styles.hasClose
      )}
    >
      <span>{label}</span>
      {onClose && (
        <Button
          withoutPadding
          rightIcon={faClose}
          appearance="link"
          size="xsmall"
          onClick={onClose}
        ></Button>
      )}
    </span>
  );
};

export default Chip;
