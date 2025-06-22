import React, { type ReactNode } from 'react';
import Header from '../Header/Header.tsx';
import Footer from '../Footer/Footer.tsx';
import styles from './layout.module.scss';
import Flex from '../../common/Flex/Flex.tsx';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="vertical" spacing="xxl" className={styles.layout}>
      <Header />
      {children}
      <Footer />
    </Flex>
  );
};

export default Layout;
