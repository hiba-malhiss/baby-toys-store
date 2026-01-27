import React, { useCallback, useMemo } from 'react';
import { Aside, Button, Toast, BouncingDotsLoader, Mask, Flex } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import styles from './admin-layout.module.scss';
import { useLogout } from '../../../api/authApi.ts';
import LanguageSwitcher from '../../i18n/LanguageSwitcher.tsx';
import { useTranslation } from 'react-i18next';
import {
  faGauge,
  faBox,
  faLayerGroup,
  faSackDollar,
  faChartLine,
  faListCheck,
  faShoppingCart,
  faTicket,
  faUsers,
  faEnvelope,
  faStar,
  faHouse,
  faGear,
  faTruck,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

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
      { label: t('menu.dashboard'), route: '/dashboard', icon: faGauge },
      { label: t('menu.products'), route: '/products', icon: faBox },
      {
        label: t('menu.catalog'),
        icon: faLayerGroup,
        items: [
          { label: t('menu.categories'), route: '/categories' },
          { label: t('menu.brands'), route: '/brands' },
          { label: t('menu.colors'), route: '/colors' },
          { label: t('menu.materials'), route: '/materials' },
        ],
      },
      {
        label: t('menu.finance'),
        icon: faSackDollar,
        items: [
          { label: t('menu.finance'), route: '/finance' },
          { label: t('menu.expenses'), route: '/expenses' },
        ],
      },
      {
        label: t('menu.analytics'),
        icon: faChartLine,
        items: [{ label: t('menu.productAnalytics'), route: '/analytics/products' }],
      },
      { label: t('menu.auditLogs'), route: '/audit-logs', icon: faListCheck },
      { label: t('menu.orders'), route: '/orders', icon: faShoppingCart },
      { label: t('menu.coupons'), route: '/coupons', icon: faTicket },
      { label: t('menu.customers'), route: '/customers', icon: faUsers },
      { label: t('menu.contactMessages'), route: '/contact-messages', icon: faEnvelope },
      { label: t('menu.reviews'), route: '/reviews', icon: faStar },
      { label: t('menu.homepage'), route: '/homepage', icon: faHouse },
      { label: t('menu.settings'), route: '/settings', icon: faGear },
      { label: t('menu.shippingOptions'), route: '/shipping-options', icon: faTruck },
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
  }, [logoutApi]);

  return (
    <>
      <Mask visible={isMaskLoading} />
      <Toast />
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
              leftIcon={faRightFromBracket}
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
