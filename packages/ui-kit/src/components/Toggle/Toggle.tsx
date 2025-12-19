import React, { useState, KeyboardEvent, useEffect } from 'react';
import styles from './toggle.module.scss';
import clsx from 'clsx';

export type ToggleSize = 'medium' | 'small';

interface ToggleProps {
  defaultValue?: boolean;
  value?: boolean;
  size?: ToggleSize;
  onChange?: (value: boolean) => void;
}

const KEY_ENTER = 13;
const KEY_ESCAPE = 27;

const Toggle: React.FC<ToggleProps> = ({ value, defaultValue = false, size = 'medium', onChange }) => {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);

  // Sync with controlled value
  useEffect(() => {
    if(value !== undefined) setInternalValue(value);
  }, [value]);

  const handleToggle = () => {
    const newValue = !internalValue;
    setInternalValue(newValue);
    if(onChange) onChange(newValue);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLButtonElement>) => {
    if(event.key === 'Enter') {
      event.preventDefault();
      handleToggle();
    } else if(event.key === 'Escape') {
      handleToggle();
    }
  };

  const classNames = clsx(
    styles.toggle,
    styles[`toggle--${size}`],
    internalValue ? styles.isTrue : styles.isFalse
  );

  return (
    <button
      type="button"
      className={classNames}
      onClick={handleToggle}
      onKeyDown={handleKeyPress}
      role="switch"
      aria-checked={internalValue}
    >
      <span className={styles.toggleThumb}/>
    </button>
  );
};

export default Toggle;
