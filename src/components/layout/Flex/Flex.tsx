import React, { type ReactNode } from 'react';
import styles from './flex.module.scss';

type Direction = 'horizontal' | 'vertical';
type Align = 'start' | 'center' | 'end';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type Spacing = 'none' | 'xs' | 's' | 'm' | 'l' | 'xl';

interface FlexProps {
  children?: ReactNode;
  spacing?: Spacing;
  direction?: Direction;
  align?: Align;
  justify?: Justify;
  fullHeight?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const Flex: React.FC<FlexProps> = ({
  children,
  spacing = 'none',
  direction = 'horizontal',
  align = 'start',
  justify = 'start',
  className = '',
  fullHeight = false,
  fullWidth = false,
}) => {
  const directionClass = direction === 'horizontal' ? styles.flexHorizontal : styles.flexVertical;

  const alignClass = {
    start: styles.flexAlignStart,
    center: styles.flexAlignCenter,
    end: styles.flexAlignEnd,
  }[align];

  const justifyClass = {
    start: styles.flexJustifyStart,
    center: styles.flexJustifyCenter,
    end: styles.flexJustifyEnd,
    between: styles.flexJustifyBetween,
    around: styles.flexJustifyAround,
    evenly: styles.flexJustifyEvenly,
  }[justify];

  const spacingClass = spacing === 'none' ? '' : styles[`flexSpacing${spacing?.toUpperCase()}`];
  const fullHeightClass = fullHeight ? styles.flexFullHeight : '';
  const fullWidthClass = fullWidth ? styles.flexFullWidth : '';

  const combinedClassName = [
    styles.flex,
    directionClass,
    alignClass,
    justifyClass,
    spacingClass,
    fullHeightClass,
    fullWidthClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={combinedClassName}>{children}</div>;
};

export default Flex;
