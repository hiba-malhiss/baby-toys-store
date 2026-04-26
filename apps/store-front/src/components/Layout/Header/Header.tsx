import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, Truck } from 'lucide-react';
import { Icon, IconColor, Flex, Button } from '@baby-toys/ui-kit';
import styles from './header.module.scss';
import SearchInputWithUrl from './SearchInputWithUrl.tsx';
import AuthButtonsWithDialogs from './AuthButtons.tsx';
import { useCartCount } from '../../../api/cartApi';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useCategories } from '../../../api/catalogApi.ts';
import clsx from 'clsx';
import BurgerMenu from './BurgerMenu.tsx';
import { useWishlistCount } from '../../../api/wishlistApi';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import { useLogo } from '../../../hooks/useLogo';

const Header = () => {
  const { data: cartCount } = useCartCount();
  const { data: categories = [] } = useCategories();
  const logoUrl = useLogo();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleCategoryClick = (category?: string) => {
    const params = new URLSearchParams(location.search);
    if (category) {
      params.set('categoryIds', String(category));
    } else {
      params.delete('categoryIds');
    }

    navigate({
      pathname: '/shop',
      search: `?${params.toString()}`,
    });
  };

  const { data: wishlistCount } = useWishlistCount();
  const { t } = useTranslation('common');

  return (
    <header className={styles.header}>
      <Flex className={styles.headerAnnouncement} align="center" justify="between" spacing="xxl">
        <Flex spacing="m" align="center">
          <Icon icon={Truck} color={IconColor.light} size="large" />
          <span>{t('nav.welcome')}</span>
        </Flex>
        <Flex align="center" spacing="s" className="bts-hideOnMobile">
          {isAuthenticated && (
            <Button
              appearance="link"
              color="light"
              onClick={() => {
                navigate('/orders-history');
              }}
            >
              {t('nav.orders')}
            </Button>
          )}
          <AuthButtonsWithDialogs isDarkMode />
          <LanguageSwitcher />
        </Flex>
      </Flex>

      <Flex className={styles.headerMain} justify="stretch" align="center" fullWidth spacing="xl">
        <div className="bts-hideOnMobile">
          <img
            src={logoUrl}
            alt="logo"
            className={styles.headerLogo}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        </div>

        <div className={styles.headerSearch}>
          <SearchInputWithUrl />
        </div>

        <Flex align="center">
          <Button
            appearance="link"
            size="xlarge"
            withoutPadding
            iconBadge={cartCount ?? 0}
            leftIconComp={ShoppingCart}
            color="secondary"
            onClick={() => navigate('/shopping-cart')}
          />
          <Button
            appearance="link"
            size="xlarge"
            withoutPadding
            leftIconComp={Heart}
            color="secondary"
            iconBadge={wishlistCount ?? 0}
            onClick={() => navigate('/wish-list')}
            className="bts-hideOnMobile"
          />
          <BurgerMenu />
        </Flex>
      </Flex>
      <div className={clsx('bts-paddingLxl bts-paddingRxl', styles.headerCategoriesContainer)}>
        <Flex
          fullWidth
          spacing="s"
          justify="center"
          align="center"
          className={clsx(styles.headerCategories, 'bts-hideScrollbar')}
        >
          <Button
            size="xsmall"
            appearance="outline"
            color="secondary-light"
            onClick={() => handleCategoryClick()}
          >
            {t('shop.all', { defaultValue: 'All' })}
          </Button>
          {categories.map(({ name, id }) => (
            <Button
              key={id}
              size="xsmall"
              appearance="outline"
              color="secondary-light"
              onClick={() => handleCategoryClick(id)}
            >
              {name}
            </Button>
          ))}
        </Flex>
      </div>
    </header>
  );
};

export default Header;
