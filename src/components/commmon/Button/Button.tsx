import React from 'react';
import styles from './button.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { appearanceClassMap, sizeClassMap } from './button.constants.ts';

type ButtonProps = {
  children?: React.ReactNode;
  appearance?: 'link' | 'light-link' | 'primary' | 'primary-link' | 'secondary';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  onClick?: () => void;
  isDisabled?: boolean;
  withoutPadding?: boolean;
  isSelected?: boolean;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  appearance = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  onClick,
  isDisabled = false,
  withoutPadding,
  isSelected,
  className,
}) => {
  const calculatedClassName = clsx(
    styles.button,
    appearanceClassMap[appearance],
    sizeClassMap[size],
    isDisabled && styles.buttonIsDisabled,
    withoutPadding && styles.buttonNoPadding,
    isSelected && styles.buttonIsSelected,
    !children && styles.buttonNoText,
    className
  );

  return (
    <button className={calculatedClassName} onClick={onClick} disabled={isDisabled}>
      {leftIcon && <FontAwesomeIcon icon={leftIcon} className={styles.buttonIcon} />}
      {children}
      {rightIcon && <FontAwesomeIcon icon={rightIcon} className={styles.buttonIcon} />}
    </button>
  );
};
