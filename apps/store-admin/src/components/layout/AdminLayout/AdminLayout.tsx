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
      <aside className={styles.sidebar}>
        <img src="/assets/images/logo.png" alt="logo" className={styles.logo} />
        <Nav className={styles.nav} direction="vertical" config={NavConfigs} />
        <Button
          onClick={handleLogout}
          appearance="link"
          className={`${styles.logoutButton} bts-marginTl`}
          withoutPadding
        >
          Logout
        </Button>
      </aside>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default AdminLayout;
