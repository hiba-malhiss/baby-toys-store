import React from 'react';
import { Menu, Button, Toast } from '@baby-toys/ui-kit/components';
import { useNavigate } from 'react-router-dom';
import styles from './admin-layout.module.scss';
import { useAuth } from '../../../context/AuthContext.tsx';

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
  { label: 'Customers', route: '/customers' },
  { label: 'Reviews', route: '/reviews' },
  { label: 'Settings', route: '/settings' },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Toast />
      <div className={styles.adminLayout}>
        <aside className={styles.adminLayoutSidebar}>
          <img src="/assets/kit-images/logo.png" alt="logo" className={styles.adminLayoutLogo} />
          <Menu model={menuItems} spacing="s" className={styles.adminLayoutNav} />
          <Button
            onClick={handleLogout}
            appearance="link"
            className={`${styles.adminLayoutLogout} bts-marginTl`}
            withoutPadding
          >
            Logout
          </Button>
        </aside>
        <main className={styles.adminLayoutContent}>{children}</main>
      </div>
    </>
  );
};

export default AdminLayout;
