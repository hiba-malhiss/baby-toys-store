import React from 'react';
import styles from './checkbox.module.scss';
import clsx from 'clsx';
import { Icon } from './index';
import { Check } from "lucide-react";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  isDisabled?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  isDisabled = false,
  className,
}) => {
  const handleClick = () => {
    if (!isDisabled) {
      onChange?.(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDisabled && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={isDisabled ? -1 : 0}
      className={clsx(
        styles.checkbox,
        className,
        checked && styles.checkboxChecked,
        isDisabled && styles.checkboxDisabled
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.checkboxCheckmark}>
        {checked && <Icon icon={Check} className={styles.checkmarkIcon} />}
      </span>
      {label && <span className={styles.checkboxLabel}>{label}</span>}
    </div>
  );
};

export default Checkbox;
