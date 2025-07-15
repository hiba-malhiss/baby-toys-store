import React, { useState, KeyboardEvent } from 'react';
import styles from './toggle.module.scss';
import clsx from 'clsx';

export type ToggleSize = 'medium' | 'small';

interface ToggleProps {
  defaultValue?: boolean;
  size?: ToggleSize;
}

const KEY_ENTER = 13;
const KEY_ESCAPE = 27;

const Toggle: React.FC<ToggleProps> = ({ defaultValue = false, size = 'medium' }) => {
  const [value, setValue] = useState(defaultValue);

  const handleToggle = () => {
    setValue(!value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.keyCode === KEY_ENTER) {
      event.preventDefault();
    } else if (event.keyCode === KEY_ESCAPE) {
      handleToggle();
    }
  };

  const classNames = clsx(
    styles.toggle,
    styles[`toggle--${size}`],
    value ? styles.isTrue : styles.isFalse
  );

  return (
    <button
      type="button"
      className={classNames}
      onClick={handleToggle}
      onKeyDown={handleKeyPress}
      role="switch"
      aria-checked={value}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
};

export default Toggle;
