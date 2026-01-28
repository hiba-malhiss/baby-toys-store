import { ComponentType, useMemo } from 'react';
import clsx from 'clsx';
import { IconColor, IconSize } from './icon.constant';
import styles from './icon.module.scss';

type LucideIconComponent = ComponentType<{
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
}>;

interface IconProps {
  icon?: LucideIconComponent | null;
  iconName?: string | null;
  size?: IconSize;
  color?: IconColor | string;
  isRotating?: boolean;
  isSpinning?: boolean;
  className?: string;
  badge?: string | number;
  title?: string;
  ariaLabel?: string;
}

const Icon = ({
  icon,
  size = IconSize.medium,
  color,
  isRotating = false,
  isSpinning = false,
  className,
  badge,
  title,
  ariaLabel,
}: IconProps) => {
  const LucideComp = icon

  const iconClass = useMemo(
    () =>
      clsx(
        styles.icon,
        color && color !== 'inherit' ? styles[`icon--${color}Color`] : undefined,
        styles[`icon--${size}Size`],
        {
          [styles.isRotating]: isRotating || isSpinning,
        }
      ),
    [color, size, isRotating, isSpinning]
  );

  const a11yProps =
    ariaLabel || title
      ? { role: 'img', 'aria-label': ariaLabel ?? title }
      : ({ 'aria-hidden': true } as const);

  if(!LucideComp) {
    return null;
  }

  return (
    <span className={clsx(styles.iconWrapper, className)}>
      <span className={iconClass}>
        <LucideComp size="1em" {...a11yProps} />
      </span>

      {!!badge && <span className={styles.iconBadge}>{badge}</span>}
    </span>
  );
};

export default Icon;
