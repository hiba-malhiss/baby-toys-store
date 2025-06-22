import React, { type MouseEventHandler } from 'react';
import styles from './button.module.scss';
import clsx from 'clsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { appearanceClassMap, sizeClassMap } from './button.constants.ts';
import { Icon } from '../Icon/Icon.tsx';

export type ButtonSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
type ButtonProps = {
  children?: React.ReactNode;
  appearance?:
    | 'link'
    | 'light-link'
    | 'primary'
    | 'primary-link'
    | 'primary2'
    | 'primary2-link'
    | 'secondary';
  size?: ButtonSize;
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
  isRounded?: boolean;
  withoutPadding?: boolean;
  withoutAutoHeight?: boolean;
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
  withoutAutoHeight = false,
  isRounded = false,
  withoutPadding,
  isSelected,
  className,
}) => {
  const calculatedClassName = clsx(
    styles.button,
    appearanceClassMap[appearance],
    sizeClassMap[size],
    isRounded && styles.isRounded,
    isDisabled && styles.isDisabled,
    withoutPadding && styles.buttonNoPadding,
    withoutAutoHeight && styles.buttonAutoHeight,
    isSelected && styles.isSelected,
    children && styles.buttonWithText,
    className
  );

  return (
    <button className={calculatedClassName} onClick={onClick} disabled={isDisabled}>
      {leftIcon && <Icon icon={leftIcon} className={styles.buttonIcon} size={size} color={null} />}
      {children}
      {rightIcon && (
        <Icon icon={rightIcon} className={styles.buttonIcon} size={size} color={null} />
      )}
    </button>
  );
};
