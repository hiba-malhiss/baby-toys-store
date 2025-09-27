import { useEffect, useMemo, useState } from 'react';
import { icon as faIcon, IconDefinition } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';
import { IconColor, IconSize } from './icon.constant.ts';
import styles from './icon.module.scss';

interface IconProps {
  icon?: IconDefinition;
  iconName?: string;
  size?: IconSize;
  color?: IconColor;
  isRotating?: boolean;
  isSpinning?: boolean;
  className?: string;
  badge?: string | number;
}

export async function loadSolidIcon(name: string): Promise<IconDefinition | undefined> {
  const mod = await import('@fortawesome/free-solid-svg-icons');
  return (mod as Record<string, IconDefinition>)[name];
}

const Icon = ({
  iconName,
  icon,
  size = IconSize.medium,
  color,
  isRotating = false,
  isSpinning = false,
  className,
  badge,
}: IconProps) => {
  const [svgHtml, setSvgHtml] = useState('');

  // Load the icon module only when iconName changes
  useEffect(() => {
    let cancelled = false;

    if (icon) {
      const svg = faIcon(icon)?.html?.join('\n') || '';
      setSvgHtml(svg);
    } else {
      loadSolidIcon(iconName).then((def) => {
        if (!cancelled) {
          const svg = faIcon(def)?.html?.join('\n') ?? '';
          setSvgHtml(svg);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [iconName, icon]);

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
