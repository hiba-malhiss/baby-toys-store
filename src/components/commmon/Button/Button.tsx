import React from 'react';
import styles from './button.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type ButtonProps = {
  children?: React.ReactNode;
  appearance?: 'link' | 'link-light' | 'primary';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  onClick?: () => void;
  isDisabled?: boolean;
  withoutPadding?: boolean;
  isSelected?: boolean;
  className?: string;
};

const appearanceClassMap = {
  primary: styles.buttonPrimary,
  link: styles.buttonLink,
  'link-light': styles.buttonLinkLight,
};

const sizeClassMap = {
  small: styles.buttonSmall,
  medium: styles.buttonMedium,
  large: styles.buttonLarge,
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
}) => {
  const calculatedClassName = clsx(
    styles.button,
    appearanceClassMap[appearance],
    sizeClassMap[size],
    withoutPadding && styles.buttonNoPadding,
    isSelected && styles.buttonIsSelected,
    !children && styles.buttonNoText
  );

  return (
    <button className={calculatedClassName} onClick={onClick} disabled={isDisabled}>
      {leftIcon && <FontAwesomeIcon icon={leftIcon} className={styles.buttonIcon} />}
      {children}
      {rightIcon && <FontAwesomeIcon icon={rightIcon} className={styles.buttonIcon} />}
    </button>
  );
};
