import { useEffect, useMemo, useState } from 'react';
import { icon as faIcon } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';
import { IconColor, IconSize } from './icon.constant.ts';
import styles from './icon.module.scss';

interface IconProps {
  icon: any;
  size?: IconSize;
  color?: IconColor;
  isRotating?: boolean;
  isSpinning?: boolean;
  className?: string;
  badge?: string | number;
}

const Icon = ({
  icon,
  size = IconSize.medium,
  color,
  isRotating = false,
  isSpinning = false,
  className,
  badge,
}: IconProps) => {
  const [svgHtml, setSvgHtml] = useState('');

  useEffect(() => {
    const svg = faIcon(icon)?.html?.join('\n') || '';
    setSvgHtml(svg);
  }, [icon]);

  const iconClass = useMemo(
    () =>
      clsx(styles.icon, styles[`icon--${color}Color`], styles[`icon--${size}Size`], {
        [styles.isRotating]: isRotating,
        'fa-spin': isSpinning,
      }),
    [color, size, isRotating, isSpinning]
  );

  return (
    <span className={clsx(styles.iconWrapper, className)}>
      <span className={iconClass} dangerouslySetInnerHTML={{ __html: svgHtml }} />
      {!!badge && <span className={styles.iconBadge}>{badge}</span>}
    </span>
  );
};

export default Icon;
