import React, { type ReactNode } from 'react';
import Header from '../Header/Header.tsx';
import Flex from '../Flex/Flex.tsx';
import Footer from '../Footer/Footer.tsx';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="vertical" spacing="xxl">
      <Header />
      {children}
      <Footer />
    </Flex>
  );
};

export default Layout;
