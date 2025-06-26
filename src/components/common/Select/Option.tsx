import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './option.module.scss';

export interface OptionProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  isSelected?: boolean;
  onSelect?: (value: string) => void;
}

export const Option: React.FC<OptionProps> = ({
  value,
  children,
  disabled = false,
  isSelected = false,
  onSelect,
}) => {
  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(value);
    }
  };

  return (
    <div
      className={clsx(styles.Option, {
        [styles.isSelected]: isSelected,
        [styles.isDisabled]: disabled,
      })}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
