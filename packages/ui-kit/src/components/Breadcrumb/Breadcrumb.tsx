import Flex from '../Flex/Flex.tsx';
import React from 'react';

type BreadcrumbProps = {
  children: React.ReactNode;
  className: string;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ children, className }) => {
  return (
    <nav className={className}>
      <Flex align="center" spacing="s">
        {children}
      </Flex>
    </nav>
  );
};

export default Breadcrumb;
