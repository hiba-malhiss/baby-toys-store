import React, { type ReactNode } from 'react';
import styles from './flex.module.scss';
import clsx from 'clsx';

export type Direction = 'horizontal' | 'vertical';
export type Align = 'start' | 'center' | 'end' | 'stretch';
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type Spacing = 'none' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl';

interface FlexProps {
  children?: ReactNode;
  spacing?: Spacing;
  direction?: Direction;
  align?: Align;
  justify?: Justify;
  fullHeight?: boolean;
  wrap?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const spacingClassMap: Record<Spacing, string | undefined> = {
  none: '',
  xs: styles.flexSpacingXs,
  s: styles.flexSpacingS,
  m: styles.flexSpacingM,
  l: styles.flexSpacingL,
  xl: styles.flexSpacingXl,
  xxl: styles.flexSpacingXxl,
  xxxl: styles.flexSpacingXxxl,
  xxxxl: styles.flexSpacingXxxxl,
};

const Flex: React.FC<FlexProps> = ({
  children,
  spacing = 'none',
  direction = 'horizontal',
  align = 'start',
  justify = 'start',
  className = '',
  fullHeight = false,
  fullWidth = false,
  wrap = false,
}) => {
  const directionClass = direction === 'horizontal' ? styles.flexHorizontal : styles.flexVertical;

  const alignClass = {
    start: styles.flexAlignStart,
    center: styles.flexAlignCenter,
    end: styles.flexAlignEnd,
    stretch: styles.flexAlignStretch,
  }[align];

  const justifyClass = {
    start: styles.flexJustifyStart,
    center: styles.flexJustifyCenter,
    end: styles.flexJustifyEnd,
    between: styles.flexJustifyBetween,
    around: styles.flexJustifyAround,
    evenly: styles.flexJustifyEvenly,
  }[justify];

  const combinedClassName = clsx(
    styles.flex,
    directionClass,
    alignClass,
    justifyClass,
    spacingClassMap[spacing],
    fullHeight && styles.flexFullHeight,
    fullWidth && styles.flexFullWidth,
    wrap && styles.flexWrap,
    className
  );

  return <div className={combinedClassName}>{children}</div>;
};

export default Flex;
