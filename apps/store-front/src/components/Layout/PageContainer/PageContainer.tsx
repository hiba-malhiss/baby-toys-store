import React from 'react';
import { Flex, BouncingDotsLoader, Heading, Mask } from '@baby-toys/ui-kit';
import styles from './page-container.module.scss';
import LayoutBreadcrumb from './LayoutBreadcrumb/LayoutBreadcrumb.tsx';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  spacing?: string;
  header?: string;
  isBreadcrumbHidden?: boolean;
  isLoading?: boolean;
  isMaskLoading?: boolean;
};

export const PageContainer = ({
  spacing,
  children,
  isBreadcrumbHidden,
  className = '',
  isLoading,
  isMaskLoading,
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
        <Mask visible={!!isMaskLoading} />
      </Flex>
    </>
  );
};
