import React, { type ReactNode } from 'react';
import { Flex, Toast } from '@baby-toys/ui-kit';
import Footer from './Footer/Footer.tsx';
import styles from './layout.module.scss';
import Header from './Header/Header.tsx';
import ShoppingCartDrawer from '../features/ShoppingCartDrawer/ShoppingCartDrawer.tsx';
import { useCartStore } from '../../store/useCartStore.ts';
import FreeShippingBanner from '../FreeShippingBanner/FreeShippingBanner.tsx';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isShippingCartDrawerOpen, openShippingCartDrawer, closeShippingCartDrawer } =
    useCartStore();
  return (
    <>
      <Toast />
      <FreeShippingBanner />
      <Flex direction="vertical" spacing="xxl" className={styles.layout}>
        <Flex direction="vertical" fullWidth>
          <Header />
          {children}
        </Flex>
        <Footer />
        <ShoppingCartDrawer
          isOpen={isShippingCartDrawerOpen}
          setIsOpen={(val) => (val ? openShippingCartDrawer() : closeShippingCartDrawer())}
        ></ShoppingCartDrawer>
      </Flex>
    </>
  );
};

export default Layout;
