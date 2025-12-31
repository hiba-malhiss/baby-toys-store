import React, { type ReactNode, useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Icon from '../Icon/Icon.tsx';
import { IconColor, IconSize } from '../Icon/icon.constant.ts';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './radio-button.module.scss';

interface RadioButtonProps {
  name?: string;
  children?: ReactNode;
  value: string;
  isSelected?: boolean;
  onChange?: (value: string) => void;
  appearance?: 'link' | 'chip' | 'link-underline' | 'field' | 'color-swatch';
  className?: string;
  swatchColor?: string;
  isRainbow?: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  children,
  value,
  isSelected,
  onChange,
  className,
  appearance = 'field',
  swatchColor,
  isRainbow,
}) => {
  const inputId = `${name}-${value}`;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Native radios do not fire onChange when clicking the already-selected option.
  // We manually trigger onChange so outer logic can toggle it off.
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if(timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if(isSelected) {
      e.preventDefault();
      timerRef.current = setTimeout(() => {
        onChange?.(value);
      }, 150); // 150ms debounce time
    }
  }, [isSelected, onChange, value]);

  useEffect(() => {
    return () => {
      if(timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <label
      htmlFor={inputId}
      className={clsx(className, styles.radioButton, styles[`radioButton--${appearance}`], {
        [styles.isSelected]: isSelected,
      })}
      onMouseDown={handleMouseDown}
    >
      <input
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={isSelected}
        onChange={() => onChange?.(value)}
      />

      {appearance === 'field' && (
        <span className={styles.radioButtonBox}>
          <Icon icon={faCheck} size={IconSize.small} color={IconColor.light}/>
        </span>
      )}

      {appearance === 'color-swatch' ? (
        <span
          className={clsx(styles.radioButtonSwatch, {
            [styles.radioButtonSwatchSelected]: isSelected,
            [styles.radioButtonSwatchRainbow]: isRainbow,
          })}
          style={isRainbow ? undefined : { background: swatchColor }}
          title={value}
        />
      ) : (
        children
      )}
    </label>
  );
};

export default RadioButton;
