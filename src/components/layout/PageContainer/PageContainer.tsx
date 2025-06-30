import React from 'react';
import styles from './page-container.module.scss';
import Flex from '../../common/Flex/Flex.tsx';
import LayoutBreadcrumb from './LayoutBreadcrumb/LayoutBreadcrumb.tsx';
import BouncingDotsLoader from '../../common/BouncingDotsLoader/BouncingDotsLoader.tsx';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  spacing?: string;
  isBreadcrumbHidden?: boolean;
  isLoading?: boolean;
};

export const PageContainer = ({
  spacing,
  children,
  isBreadcrumbHidden,
  className = '',
  isLoading,
}: PageContainerProps) => {
  return (
    <>
      {!isBreadcrumbHidden && <LayoutBreadcrumb className={styles.breadcrumb} />}
      {isLoading && <BouncingDotsLoader className="bts-paddingVxxl" />}
      <Flex
        fullWidth
        direction="vertical"
        spacing={spacing || 'xxl'}
        className={`${styles.pageContainer} ${className}`}
      >
        {!isLoading && children}
      </Flex>
    </>
  );
};
