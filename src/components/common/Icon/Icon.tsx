import { useEffect, useMemo, useState } from 'react';
import { icon as faIcon } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';
import { iconClassMap, IconColor, IconSize } from './icon.constant.ts';
import styles from './icon.module.scss';

interface IconProps {
  icon: any;
  size?: IconSize;
  color?: IconColor;
  isRotating?: boolean;
  className?: string;
}

export const Icon = ({
  icon,
  size = IconSize.medium,
  color = IconColor.primary,
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
      clsx(styles.icon, iconClassMap.color[color], iconClassMap.size[size], {
        [styles.isRotating]: isRotating,
      }),
    [color, size, isRotating]
  );

  return (
    <span className={clsx(className, iconClass)} dangerouslySetInnerHTML={{ __html: svgHtml }} />
  );
};
