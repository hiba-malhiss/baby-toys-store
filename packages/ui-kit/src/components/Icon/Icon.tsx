import { ComponentType, useEffect, useMemo, useState } from 'react';
import { icon as faIcon, type IconDefinition } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';
import { IconColor, IconSize } from './icon.constant';
import styles from './icon.module.scss';
import * as LucideIcons from './lucide-icons';

type LucideIconComponent = ComponentType<{
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
}>;

interface IconProps {
  icon?: IconDefinition;
  iconName?: string;
  lucideComp?: LucideIconComponent | null;
  size?: IconSize;
  color?: IconColor;
  isRotating?: boolean;
  isSpinning?: boolean;
  className?: string;
  badge?: string | number;
  title?: string;
  ariaLabel?: string;
}

export async function loadSolidIcon(name: string): Promise<IconDefinition | undefined>{
  const mod = await import('@fortawesome/free-solid-svg-icons');
  return (mod as Record<string, IconDefinition>)[name];
}

function toPascalCase(name: string){
  // supports: "chevron-down", "chevron_down", "chevron down"
  return name
    .trim()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function getLucideFromName(iconName?: string): LucideIconComponent | null{
  if(!iconName) return null;
  if(!iconName.startsWith('lucide:')) return null;

  const raw = iconName.slice('lucide:'.length);
  if(!raw) return null;

  const compName = toPascalCase(raw);
  const Comp = (LucideIcons as Record<string, LucideIconComponent | undefined>)[compName];
  return Comp ?? null;
}

const Icon = ({
                iconName,
                icon,
                lucideComp,
                size = IconSize.medium,
                color,
                isRotating = false,
                isSpinning = false,
                className,
                badge,
                title,
                ariaLabel,
              }: IconProps) => {
  const [svgHtml, setSvgHtml] = useState('');
  const [LucideComp, setLucideComp] = useState<LucideIconComponent | null>(null);

  useEffect(() => {
    let cancelled = false;

    setSvgHtml('');
    setLucideComp(null);

    // 1) FontAwesome by definition
    if(icon) {
      const svg = faIcon(icon)?.html?.join('\n') || '';
      if(!cancelled) setSvgHtml(svg);
      return () => {
        cancelled = true;
      };
    }

    // 2) Lucide by direct component
    if(lucideComp) {
      if(!cancelled) setLucideComp(() => lucideComp);
      return () => {
        cancelled = true;
      };
    }

    // 3) Lucide by "lucide:*" name
    const namedLucide = getLucideFromName(iconName);
    if(namedLucide) {
      if(!cancelled) setLucideComp(() => namedLucide);
      return () => {
        cancelled = true;
      };
    }

    // 4) Fallback: old FontAwesome iconName (migration only)
    if(iconName) {
      loadSolidIcon(iconName).then((def) => {
        if(cancelled) return;
        const svg = faIcon(def)?.html?.join('\n') ?? '';
        setSvgHtml(svg);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [iconName, icon, lucideComp]);

  const iconClass = useMemo(
    () =>
      clsx(styles.icon, styles[`icon--${color}Color`], styles[`icon--${size}Size`], {
        [styles.isRotating]: isRotating || isSpinning,
      }),
    [color, size, isRotating, isSpinning]
  );

  const a11yProps =
    ariaLabel || title
      ? { role: 'img', 'aria-label': ariaLabel ?? title }
      : { 'aria-hidden': true as const };

  return (
    <span className={clsx(styles.iconWrapper, className)}>
      <span className={iconClass}>
        {LucideComp ? (
          <LucideComp size="1em" {...a11yProps} />
        ) : (
          // temp
          <span dangerouslySetInnerHTML={{ __html: svgHtml }} {...a11yProps} />
        )}
      </span>

      {!!badge && <span className={styles.iconBadge}>{badge}</span>}
    </span>
  );
};

export default Icon;
