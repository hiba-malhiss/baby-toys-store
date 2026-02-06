import React, { useEffect, useState, KeyboardEvent } from 'react';
import clsx from 'clsx';
import styles from './toggle.module.scss';

export type ToggleSize = 'medium' | 'small';

interface ToggleProps {
  // New API (preferred)
  value?: boolean;
  disabled?: boolean;

  // Legacy API (support existing usages)
  checked?: boolean;
  isDisabled?: boolean;

  defaultValue?: boolean;
  size?: ToggleSize;
  onChange?: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  value,
  checked,
  defaultValue = false,
  size = 'medium',
  onChange,
  disabled,
  isDisabled,
}) => {
  // Support both "value" and "checked"
  const controlledValue = value ?? checked;
  const resolvedDisabled = (disabled ?? isDisabled) === true;

  const [internalValue, setInternalValue] = useState<boolean>(controlledValue ?? defaultValue);

  // Sync internal state when controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(!!controlledValue);
    }
  }, [controlledValue]);

  const handleToggle = () => {
    if (resolvedDisabled) return;

    const newValue = !internalValue;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (resolvedDisabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  const classNames = clsx(
    styles.toggle,
    styles[`toggle--${size}`],
    internalValue ? styles.isTrue : styles.isFalse,
    resolvedDisabled && styles.isDisabled
  );

  return (
    <button
      type="button"
      className={classNames}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={internalValue}
      aria-disabled={resolvedDisabled}
      disabled={resolvedDisabled}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
};

export default Toggle;
