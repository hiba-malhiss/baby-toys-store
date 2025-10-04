import React from 'react';
import clsx from 'clsx';
import styles from './heading.module.scss';

export type HeadingAlign = 'left' | 'center' | 'right';
export type HeadingAppearance = 'dark' | 'light' | 'white';
export type HeadingLevel = 'h0' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps {
  align?: HeadingAlign;
  appearance?: HeadingAppearance;
  level?: HeadingLevel;
  tag?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  align,
  appearance,
  level = 'h1',
  tag,
  children,
  className,
}) => {
  const headingTag = tag || level;
  const Tag = headingTag as keyof JSX.IntrinsicElements;

  const headingClassName = clsx(
    styles.heading,
    styles[`heading--${align}Align`],
    styles[`heading--${appearance}Appearance`],
    styles[`heading--${level}Level`]
  );

  return <Tag className={clsx(className, headingClassName)}>{children}</Tag>;
};

export default Heading;
