import React from 'react';
import styles from './page-container.module.scss';
import Flex from '../../common/Flex/Flex.tsx';
import LayoutBreadcrumb from './LayoutBreadcrumb/LayoutBreadcrumb.tsx';
import BouncingDotsLoader from '../../common/BouncingDotsLoader/BouncingDotsLoader.tsx';
import Heading from '../../common/Heading/Heading.tsx';

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
