import styles from './section.module.scss';
import Flex from '../../../components/layout/Flex/Flex.tsx';
import type { ReactNode } from 'react';
import clsx from 'clsx';

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
      <h2 className={styles.sectionTitle}>{title}</h2>
      {subTitle && <h4 className={styles.sectionSubTitle}>{subTitle}</h4>}
      {children}
    </Flex>
  );
};

export default Section;
