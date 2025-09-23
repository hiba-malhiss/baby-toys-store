import styles from './section.module.scss';
import { Flex } from '@baby-toys/ui-kit';
import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { Heading, BouncingDotsLoader } from '@baby-toys/ui-kit';

interface SectionProps {
  children?: ReactNode;
  title: string;
  subTitle?: string;
  className?: string;
  compactPadding?: boolean;
  isLoading?: boolean;
}

const Section = ({
  compactPadding,
  subTitle,
  className,
  title,
  children,
  isLoading,
}: SectionProps) => {
  return (
    <Flex
      className={clsx(className, styles.section, compactPadding && styles.sectionCompactPadding)}
      direction="vertical"
      justify="center"
      align="center"
      fullWidth
    >
      <Heading level="h1" align="center">
        {title}
      </Heading>
      {subTitle && (
        <Heading level="h5" align="center" className={styles.sectionSubTitle}>
          {subTitle}
        </Heading>
      )}
      {isLoading && (
        <BouncingDotsLoader
          className={!subTitle ? 'bts-paddingVxxxl bts-marginTxxxl' : 'bts-paddingVxxl'}
        />
      )}
      {!isLoading && children}
    </Flex>
  );
};

export default Section;
