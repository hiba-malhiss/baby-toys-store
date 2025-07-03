import React, { type ReactNode } from 'react';
import Header from '../Header/Header.tsx';
import Footer from '../Footer/Footer.tsx';
import styles from './layout.module.scss';
import Flex from '../../common/Flex/Flex.tsx';
import ShoppingCartDrawer from '../../smart/ShoppingCartDrawer/ShoppingCartDrawer.tsx';
import { useCartStore } from '../../../store/useCartStore.ts';
import { Toast } from '../../common/Toast/Toast.tsx';
import FlashSaleBanner from './FlashSaleBanner.tsx';
import { useCartSync } from '../../../hooks/useCartSync.ts';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isShippingCartDrawerOpen, openShippingCartDrawer, closeShippingCartDrawer } =
    useCartStore();
  useCartSync();

  return (
    <>
      <Toast />
      <FlashSaleBanner />
      <Flex direction="vertical" spacing="xxl" className={styles.layout}>
        <div style={{ width: '100%' }}>
          <Header />
          {children}
        </div>
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
