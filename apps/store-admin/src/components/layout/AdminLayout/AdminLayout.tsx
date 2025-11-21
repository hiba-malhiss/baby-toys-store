import React, { useCallback } from 'react';
import { Menu, Button, Toast, BouncingDotsLoader, Mask, Flex } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import styles from './admin-layout.module.scss';
import { useLogout } from '../../../api/authApi.ts';
import LanguageSwitcher from '../../i18n/LanguageSwitcher.tsx';

const menuItems = [
  { label: 'Dashboard', route: '/dashboard' },
  { label: 'Products', route: '/products' },
  {
    label: 'Catalog',
    items: [
      { label: 'Categories', route: '/categories' },
      { label: 'Brands', route: '/brands' },
      { label: 'Colors', route: '/colors' },
      { label: 'Materials', route: '/materials' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Finance', route: '/finance' },
      { label: 'Expenses', route: '/expenses' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Product Analytics', route: '/analytics/products' },
    ],
  },
  { label: 'Orders', route: '/orders' },
  { label: 'Coupons', route: '/coupons' },
  { label: 'Customers', route: '/customers' },
  { label: 'Contact Messages', route: '/contact-messages' },
  { label: 'Reviews', route: '/reviews' },
  { label: 'Home page content', route: '/homepage' },
  { label: 'Store settings', route: '/settings' },
  { label: 'Shipping options', route: '/shipping-options' },
];

const AdminLayout: React.FC<{
  children: React.ReactNodem;
  isLoading?: boolean;
  isMaskLoading?: boolean;
}> = ({ children, isLoading, isMaskLoading }) => {
  const navigate = useNavigate();
  const { mutateAsync: logoutApi } = useLogout();

  const logout = useCallback(async() => {
    try {
      await logoutApi();
      navigate('/login');
    } catch(error) {
      console.error('Logout failed:', error);
    }
  }, [logoutApi]);

  return (
    <>
      <Mask visible={isMaskLoading}/>
      <Toast/>
      <div className={styles.adminLayout}>
        <aside className={styles.adminLayoutSidebar}>
          <Flex justify="between" align="center">
            <img src="/assets/kit-images/logo.png" alt="logo" className={styles.adminLayoutLogo}/>
            <LanguageSwitcher/>
          </Flex>
          <Menu model={menuItems} spacing="s" className={styles.adminLayoutNav}/>
          <Button
            fullWidth
            onClick={logout}
            appearance="outline"
            className={`${styles.adminLayoutLogout} bts-marginTl`}
          >
            Logout
          </Button>
        </aside>
        <main className={styles.adminLayoutContent}>
          {isLoading ? <BouncingDotsLoader className="bts-marginTxxxl"/> : children}
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
