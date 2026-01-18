import React, { useCallback, useMemo } from 'react';
import { Menu, Button, Toast, BouncingDotsLoader, Mask, Flex } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import styles from './admin-layout.module.scss';
import { useLogout } from '../../../api/authApi.ts';
import LanguageSwitcher from '../../i18n/LanguageSwitcher.tsx';
import { useTranslation } from 'react-i18next';

const AdminLayout: React.FC<{
  children: React.ReactNodem;
  isLoading?: boolean;
  isMaskLoading?: boolean;
}> = ({ children, isLoading, isMaskLoading }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutateAsync: logoutApi } = useLogout();

  const menuItems = useMemo(
    () => [
      { label: t('menu.dashboard'), route: '/dashboard' },
      { label: t('menu.products'), route: '/products' },
      {
        label: t('menu.catalog'),
        items: [
          { label: t('menu.categories'), route: '/categories' },
          { label: t('menu.brands'), route: '/brands' },
          { label: t('menu.colors'), route: '/colors' },
          { label: t('menu.materials'), route: '/materials' },
        ],
      },
      {
        label: t('menu.finance'),
        items: [
          { label: t('menu.finance'), route: '/finance' },
          { label: t('menu.expenses'), route: '/expenses' },
        ],
      },
      {
        label: t('menu.analytics'),
        items: [{ label: t('menu.productAnalytics'), route: '/analytics/products' }],
      },
      { label: t('menu.orders'), route: '/orders' },
      { label: t('menu.coupons'), route: '/coupons' },
      { label: t('menu.customers'), route: '/customers' },
      { label: t('menu.contactMessages'), route: '/contact-messages' },
      { label: t('menu.reviews'), route: '/reviews' },
      { label: t('menu.homepage'), route: '/homepage' },
      { label: t('menu.settings'), route: '/settings' },
      { label: t('menu.shippingOptions'), route: '/shipping-options' },
    ],
    [t]
  );

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
          <Menu autoOverflow model={menuItems} spacing="s" className={styles.adminLayoutNav}/>
          <Button
            fullWidth
            onClick={logout}
            appearance="outline"
            className={`${styles.adminLayoutLogout} bts-marginTl`}
          >
            {t('app.logout')}
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
