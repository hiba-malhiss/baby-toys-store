import React from 'react';
import { Nav, Button } from '@baby-toys/ui-kit/components';
import { useNavigate } from 'react-router-dom';
import styles from './admin-layout.module.scss';
import { useAuth } from '../../../context/AuthContext.tsx';

const NavConfigs = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Products', path: '/products' },
  { label: 'Categories', path: '/categories' },
  { label: 'Orders', path: '/orders' },
  { label: 'Customers', path: '/customers' },
  { label: 'Reviews', path: '/reviews' },
  { label: 'Settings', path: '/settings' },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.adminLayoutSidebar}>
        <img src="/assets/ui-kit-images/logo.png" alt="logo" className={styles.adminLayoutLogo} />
        <Nav className={styles.adminLayoutNav} direction="vertical" config={NavConfigs} />
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
  );
};

export default AdminLayout;
