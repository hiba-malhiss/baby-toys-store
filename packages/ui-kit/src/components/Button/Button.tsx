import { forwardRef, type MouseEventHandler, type ReactNode } from 'react';
import styles from './button.module.scss';
import clsx from 'clsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Icon from '../Icon/Icon.tsx';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { IconColor } from '../Icon/icon.constant.ts';

export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
export type ButtonAppearance = 'link' | 'filled' | 'outline';
export type ButtonColor =
  | 'primary'
  | 'accent'
  | 'secondary'
  | 'light'
  | 'icon'
  | 'highlighted'
  | 'secondary-light';

type ButtonProps = {
  children?: ReactNode;
  appearance?: ButtonAppearance;
  color?: ButtonColor;
  size?: ButtonSize;
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
  isRounded?: boolean;
  iconColor?: IconColor;
  withoutPadding?: boolean;
  withAutoHeight?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  align?: string;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      appearance = 'filled',
      color = 'primary',
      size = 'medium',
      leftIcon,
      rightIcon,
      onClick,
      isDisabled = false,
      isLoading = false,
      withAutoHeight = false,
      fullWidth = false,
      isRounded = false,
      withoutPadding,
      isSelected,
      className,
      align,
      iconColor,
      ...rest
    },
    ref
  ) => {
    const calculatedClassName = clsx(
      styles.button,
      isRounded && styles.isRounded,
      styles['button--' + size + 'Size'],
      styles['button--' + color + 'Color'],
      styles['button--' + appearance + 'Appearance'],
      styles['button--' + align + 'Align'],
      isDisabled && styles.isDisabled,
      fullWidth && styles.fullWidth,
      withoutPadding && styles.buttonNoPadding,
      withAutoHeight && styles.buttonAutoHeight,
      isSelected && styles.isSelected,
      children && styles.buttonWithText
    );

    return (
      <div className={clsx(className)}>
        <button
          ref={ref}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onClick && onClick(e);
            }
          }}
          className={calculatedClassName}
          onClick={onClick}
          disabled={isDisabled}
          {...rest}
        >
          {isLoading ? (
            <Icon isSpinning icon={faSpinner} className={clsx(styles.buttonIcon)} size={size} />
          ) : (
            <>
              {leftIcon && (
                <Icon color={iconColor} icon={leftIcon} className={styles.buttonIcon} size={size} />
              )}
              {children}
              {rightIcon && (
                <Icon
                  color={iconColor}
                  icon={rightIcon}
                  className={styles.buttonIcon}
                  size={size}
                />
              )}
            </>
          )}
        </button>
      </div>
    );
  }
);

export default Button;
