import React from 'react';
import styles from './page-container.module.scss';
import Flex from '../../common/Flex/Flex.tsx';
import LayoutBreadcrumb from './LayoutBreadcrumb/LayoutBreadcrumb.tsx';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  spacing?: string;
};

export const PageContainer = ({ spacing, children, className = '' }: PageContainerProps) => {
  return (
    <>
      <LayoutBreadcrumb className={styles.breadcrumb} />
      <Flex
        fullWidth
        direction="vertical"
        spacing={spacing || 'xxl'}
        className={`${styles.pageContainer} ${className}`}
      >
        {children}
      </Flex>
    </>
  );
};
