import React, { useCallback } from 'react';
import { Menu, Button, Toast, BouncingDotsLoader, Mask } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import styles from './admin-layout.module.scss';
import { useLogout } from '../../../api/authApi.ts';

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
  { label: 'Orders', route: '/orders' },
  { label: 'Coupons', route: '/coupons' },
  { label: 'Customers', route: '/customers' },
  { label: 'Reviews', route: '/reviews' },
  { label: 'Home page content', route: '/homepage' },
  { label: 'Store settings', route: '/settings' },
];

const AdminLayout: React.FC<{
  children: React.ReactNodem;
  isLoading?: boolean;
  isMaskLoading?: boolean;
}> = ({ children, isLoading, isMaskLoading }) => {
  const navigate = useNavigate();
  const { mutateAsync: logoutApi } = useLogout();

  const logout = useCallback(async () => {
    try {
      await logoutApi();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logoutApi]);

  return (
    <>
      <Mask visible={isMaskLoading} />
      <Toast />
      <div className={styles.adminLayout}>
        <aside className={styles.adminLayoutSidebar}>
          <img src="/assets/kit-images/logo.png" alt="logo" className={styles.adminLayoutLogo} />
          <Menu model={menuItems} spacing="s" className={styles.adminLayoutNav} />
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
          {isLoading ? <BouncingDotsLoader className="bts-marginTxxxl" /> : children}
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
