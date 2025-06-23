import { useEffect, useMemo, useState } from 'react';
import { icon as faIcon } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';
import { IconColor, IconSize } from './icon.constant.ts';
import styles from './icon.module.scss';

interface IconProps {
  icon: any;
  size?: IconSize | string | null;
  color?: IconColor | string | null;
  isRotating?: boolean;
  className?: string;
}

export const Icon = ({
  icon,
  size = IconSize.medium,
  color,
  isRotating = false,
  className,
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
      }),
    [color, size, isRotating]
  );

  return (
    <span className={clsx(className, iconClass)} dangerouslySetInnerHTML={{ __html: svgHtml }} />
  );
};
