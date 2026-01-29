import { forwardRef, type MouseEventHandler, type ReactNode, type ComponentType } from 'react';
import styles from './button.module.scss';
import clsx from 'clsx';
import Icon from '../Icon/Icon.tsx';
import { LoaderCircle } from 'lucide-react';
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
  | 'underline'
  | 'error'
  | 'secondary-light';

type ButtonProps = {
  children?: ReactNode;
  appearance?: ButtonAppearance;
  color?: ButtonColor;
  size?: ButtonSize;
  leftIconComp?: ComponentType<any> | null;
  rightIconComp?: ComponentType<any> | null;
  iconColor?: IconColor | ButtonColor | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
  isRounded?: boolean;
  withoutPadding?: boolean;
  withAutoHeight?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  iconBadge?: string;
  align?: string;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      appearance = 'filled',
      color = 'primary',
      size = 'medium',
      leftIconComp,
      rightIconComp,
      iconColor,
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
      iconBadge,
      type,
      form,
      ...rest
    },
    ref
  ) => {
    const resolvedDisabled = !!isDisabled;
    const resolvedLoading = !!isLoading;
    const resolvedFullWidth = !!fullWidth;
    const resolvedType = type ?? 'button';
    const resolvedIconColor = iconColor ?? 'inherit';
    const isIconOnly = !children && (!!leftIconComp || !!rightIconComp);

    const calculatedClassName = clsx(
      styles.button,
      isRounded && styles.isRounded,
      styles['button--' + size + 'Size'],
      styles['button--' + color + 'Color'],
      styles['button--' + appearance + 'Appearance'],
      align && styles['button--' + align + 'Align'],
      resolvedDisabled && styles.isDisabled,
      resolvedFullWidth && styles.fullWidth,
      withoutPadding && styles.buttonNoPadding,
      withAutoHeight && styles.buttonAutoHeight,
      isSelected && styles.isSelected,
      children && styles.buttonWithText
    );

    return (
      <div className={clsx(className, resolvedFullWidth && styles.fullWidth)}>
        <button
          ref={ref}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onClick && onClick(e);
            }
          }}
          className={calculatedClassName}
          onClick={onClick}
          disabled={resolvedDisabled || resolvedLoading}
          type={resolvedType}
          form={form}
          {...rest}
        >
          {resolvedLoading && (
            <Icon
              isSpinning
              icon={LoaderCircle}
              className={clsx(styles.buttonIcon)}
              size={size}
              color={resolvedIconColor}
            />
          )}

          {leftIconComp && (!resolvedLoading || !isIconOnly) && (
            <Icon
              color={resolvedIconColor}
              icon={leftIconComp}
              className={styles.buttonIcon}
              size={size}
              badge={iconBadge}
            />
          )}

          {children}

          {rightIconComp && (!resolvedLoading || !isIconOnly) && (
            <Icon
              color={resolvedIconColor}
              icon={rightIconComp}
              className={styles.buttonIcon}
              size={size}
              badge={iconBadge}
            />
          )}
        </button>
      </div>
    );
  }
);

export default Button;
