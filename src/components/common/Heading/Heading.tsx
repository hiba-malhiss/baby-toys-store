import React from 'react';
import clsx from 'clsx';
import styles from './heading.module.scss';
import { alignClassMap, appearanceClassMap, levelClassMap } from './heading.constants';

export type HeadingAlign = keyof typeof alignClassMap;
export type HeadingAppearance = keyof typeof appearanceClassMap;
export type HeadingLevel = keyof typeof levelClassMap;

interface HeadingProps {
  align?: HeadingAlign;
  appearance?: HeadingAppearance;
  level?: HeadingLevel;
  tag?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  align = 'left',
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
    alignClassMap[align],
    appearanceClassMap[appearance],
    levelClassMap[level]
  );

  return <Tag className={clsx(className, headingClassName)}>{children}</Tag>;
};

export default Heading;
