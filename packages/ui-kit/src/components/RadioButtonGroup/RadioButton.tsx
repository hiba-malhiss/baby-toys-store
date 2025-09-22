import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Icon from '../Icon/Icon.tsx';
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

  return (
    <label
      htmlFor={inputId}
      className={clsx(className, styles.radioButton, styles[`radioButton--${appearance}`], {
        [styles.isSelected]: isSelected,
      })}
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
          <Icon icon={faCheck} size="xsmall" />
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
