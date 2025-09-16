import React from 'react';
import clsx from 'clsx';
import styles from './text.module.scss';

type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
type TextColor = 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'warning' | 'info' | 'dark' | 'light';
type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface TextProps {
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  truncate?: boolean;
  uppercase?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  title?: string;
}

const Text: React.FC<TextProps> = ({
  size = 'md',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  truncate = false,
  uppercase = false,
  className,
  style,
  children,
  ...rest
}) => {
  const classes = clsx(
    styles.text,
    styles[`size-${size}`],
    styles[`weight-${weight}`],
    styles[`color-${color}`],
    styles[`align-${align}`],
    {
      [styles.truncate]: truncate,
      [styles.uppercase]: uppercase,
    },
    className
  );

  return (
    <span className={classes} style={style} {...rest}>
      {children}
    </span>
  );
};

export default Text;
