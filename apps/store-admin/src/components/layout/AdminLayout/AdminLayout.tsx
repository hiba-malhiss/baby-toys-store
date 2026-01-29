import React, { useCallback, useMemo } from 'react';
import { Aside, Button, BouncingDotsLoader, Mask, Flex } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import styles from './admin-layout.module.scss';
import { useLogout } from '../../../api/authApi.ts';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Box,
  Layers,
  Wallet,
  LineChart,
  ListChecks,
  ShoppingCart,
  Ticket,
  Users,
  Mail,
  Star,
  Home,
  Settings,
  Truck,
  LogOut,
} from 'lucide-react';
import LanguageSwitcher from '../../../i18n/LanguageSwitcher.tsx';

const AdminLayout: React.FC<{
  children: React.ReactNode;
  isLoading?: boolean;
  isMaskLoading?: boolean;
}> = ({ children, isLoading, isMaskLoading }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutateAsync: logoutApi } = useLogout();

  const menuItems = useMemo(
    () => [
      { label: t('menu.dashboard'), route: '/dashboard', iconComp: LayoutDashboard },
      { label: t('menu.products'), route: '/products', iconComp: Box },
      {
        label: t('menu.catalog'),
        iconComp: Layers,
        items: [
          { label: t('menu.categories'), route: '/categories' },
          { label: t('menu.brands'), route: '/brands' },
          { label: t('menu.colors'), route: '/colors' },
          { label: t('menu.materials'), route: '/materials' },
        ],
      },
      {
        label: t('menu.finance'),
        iconComp: Wallet,
        items: [
          { label: t('menu.finance'), route: '/finance' },
          { label: t('menu.expenses'), route: '/expenses' },
        ],
      },
      {
        label: t('menu.analytics'),
        iconComp: LineChart,
        items: [{ label: t('menu.productAnalytics'), route: '/analytics/products' }],
      },
      { label: t('menu.auditLogs'), route: '/audit-logs', iconComp: ListChecks },
      { label: t('menu.orders'), route: '/orders', iconComp: ShoppingCart },
      { label: t('menu.coupons'), route: '/coupons', iconComp: Ticket },
      { label: t('menu.customers'), route: '/customers', iconComp: Users },
      { label: t('menu.contactMessages'), route: '/contact-messages', iconComp: Mail },
      { label: t('menu.reviews'), route: '/reviews', iconComp: Star },
      { label: t('menu.homepage'), route: '/homepage', iconComp: Home },
      { label: t('menu.settings'), route: '/settings', iconComp: Settings },
      {
        label: t('menu.delivery'),
        iconComp: Truck,
        items: [
          { label: t('menu.zones'), route: '/delivery/zones' },
          { label: t('menu.towns'), route: '/delivery/towns' },
        ],
      },
    ],
    [t]
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logoutApi, navigate]);

  return (
    <>
      <Mask visible={isMaskLoading} />
      <div className={styles.adminLayout}>
        <Aside
          autoOverflow
          model={menuItems}
          header={
            <Flex justify="between" align="center" wrap fullWidth>
              <img
                src="/assets/kit-images/logo.png"
                alt="logo"
                className={styles.adminLayoutLogo}
              />
              <LanguageSwitcher />
            </Flex>
          }
          footerExpanded={
            <Button
              fullWidth
              onClick={logout}
              appearance="outline"
              className={`${styles.adminLayoutLogout} bts-marginTl`}
            >
              {t('app.logout')}
            </Button>
          }
          footerCollapsed={
            <Button
              onClick={logout}
              appearance="link"
              withoutPadding
              fullWidth
              align="center"
              leftIconComp={LogOut}
            />
          }
        />
        <main className={styles.adminLayoutContent}>
          {isLoading ? <BouncingDotsLoader className="bts-marginTxxxl" /> : children}
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
