import React, { type ReactNode } from 'react';
import { Flex, Toast, BouncingDotsLoader } from '@baby-toys/ui-kit';
import Footer from './Footer/Footer.tsx';
import styles from './layout.module.scss';
import { useCartStore } from '../../store/useCartStore.ts';
import FlashSaleBanner from './FlashSaleBanner.tsx';
import { useCartSync } from '../../hooks/useCartSync.ts';
import Header from './Header/Header.tsx';
import ShoppingCartDrawer from '../features/ShoppingCartDrawer/ShoppingCartDrawer.tsx';
import { useStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isShippingCartDrawerOpen, openShippingCartDrawer, closeShippingCartDrawer } =
    useCartStore();
  const { isLoadingConfigs } = useStoreConfiguration();
  useCartSync();

  if (isLoadingConfigs) {
    return <BouncingDotsLoader className="bts-marginTxxxl" />;
  }
  return (
    <>
      <Toast />
      <FlashSaleBanner />
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
