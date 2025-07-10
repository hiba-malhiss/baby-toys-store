import React from 'react';
import { Flex, BouncingDotsLoader, Heading } from '@baby-toys/ui-kit/components';
import styles from './page-container.module.scss';
import LayoutBreadcrumb from './LayoutBreadcrumb/LayoutBreadcrumb.tsx';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  spacing?: string;
  header?: string;
  isBreadcrumbHidden?: boolean;
  isLoading?: boolean;
};

export const PageContainer = ({
  spacing,
  children,
  isBreadcrumbHidden,
  className = '',
  isLoading,
  header,
}: PageContainerProps) => {
  return (
    <>
      {!isBreadcrumbHidden && <LayoutBreadcrumb className={styles.breadcrumb} />}
      <Flex
        fullWidth
        direction="vertical"
        spacing={spacing || 'xxl'}
        className={`${styles.pageContainer} ${className}`}
      >
        {header && (
          <Heading level="h1" className="bts-marginBxl bts-marginTxxxxl">
            {header}
          </Heading>
        )}
        {isLoading && <BouncingDotsLoader className="bts-paddingVxxl" />}
        {!isLoading && children}
      </Flex>
    </>
  );
};
