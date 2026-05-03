import React from 'react';
import styles from './value-chip.module.scss';
import clsx from 'clsx';
import Button from '../Button/Button.tsx';
import { Pencil, Trash2 } from 'lucide-react';

type ValueChipProps = {
  label: string;
  code?: string;
  secondaryLabel?: string;
  inactive?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  editable?: boolean;
  className?: string;
};

const ValueChip: React.FC<ValueChipProps> = ({
  label,
  code,
  secondaryLabel,
  inactive = false,
  onEdit,
  onDelete,
  editable = true,
  className,
}) => {
  return (
    <div className={clsx(styles.valueChip, inactive && styles.valueChipInactive, className)}>
      <span>{label}</span>
      {secondaryLabel && (
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>
          / {secondaryLabel}
        </span>
      )}
      {code && <span className={styles.valueChipCode}>{code}</span>}
      {editable && (onEdit || onDelete) && (
        <span className={styles.valueChipActions}>
          {onEdit && (
            <Button
              size="small"
              appearance="link"
              leftIconComp={Pencil}
              onClick={onEdit}
              title="Edit"
            />
          )}
          {onDelete && (
            <Button
              size="small"
              appearance="link"
              color="error"
              leftIconComp={Trash2}
              onClick={onDelete}
              title="Delete"
            />
          )}
        </span>
      )}
    </div>
  );
};

export default ValueChip;
