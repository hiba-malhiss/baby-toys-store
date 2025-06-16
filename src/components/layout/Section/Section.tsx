import styles from './section.module.scss';
import Flex from '../../../components/common/Flex/Flex.tsx';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '../../common/Heading/Heading.tsx';

interface SectionProps {
  children?: ReactNode;
  title: string;
  subTitle?: string;
  className?: string;
  compactPadding?: boolean;
}

const Section = ({ compactPadding, subTitle, className, title, children }: SectionProps) => {
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
      {children}
    </Flex>
  );
};

export default Section;
