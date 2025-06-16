import Flex from '../../layout/Flex/Flex.tsx';
import React from 'react';

type BreadcrumbProps = {
  children: React.ReactNode;
  className: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ children, className }) => {
  return (
    <nav className={className}>
      <Flex align="center" spacing="s">
        {children}
      </Flex>
    </nav>
  );
};
