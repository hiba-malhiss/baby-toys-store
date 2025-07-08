import styles from './section.module.scss';
import Flex from '../../../components/common/Flex/Flex.tsx';
import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '../../common/Heading/Heading.tsx';
import BouncingDotsLoader from '../../common/BouncingDotsLoader/BouncingDotsLoader.tsx';

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
