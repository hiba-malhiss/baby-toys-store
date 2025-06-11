import React, { type InputHTMLAttributes } from 'react';
import styles from './input.module.css';
import clsx from 'clsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../Button/Button.tsx';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  fullWidth?: boolean;
  iconRight?: IconDefinition;
  iconLeft?: IconDefinition;
  isSearch?: boolean;
  size?: 'small' | 'medium' | 'large';
};

const sizeMap = {
  small: styles.inputSmall,
  medium: styles.inputMedium,
  large: styles.inputLarge,
};

export const Input: React.FC<InputProps> = ({
  fullWidth = false,
  isSearch = false,
  iconRight,
  iconLeft,
  size = 'medium',
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        styles.input,
        fullWidth && styles.inputWrapperFullWidth,
        sizeMap[size],
        isSearch && styles.inputSearch,
        className
      )}
    >
      {iconLeft && <FontAwesomeIcon icon={iconLeft} className="bts-marginRs" />}
      <input
        {...props}
        className={clsx(styles.inputField, className)}
        placeholder={props.placeholder}
      />
      {isSearch && <Button size="large" leftIcon={faMagnifyingGlass}></Button>}
      {iconRight && !isSearch && <FontAwesomeIcon icon={iconRight} />}
    </div>
  );
};
