import { useNavigate, useLocation } from 'react-router-dom';
import { faHeart, faShoppingCart, faTruckFast } from '@fortawesome/free-solid-svg-icons';
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

const Header = () => {
  const { data: cartCount } = useCartCount();
  const { data: categories = [] } = useCategories();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleCategoryClick = (category?: string) => {
    const params = new URLSearchParams(location.search);
    if(category) {
      params.set('categoryId', String(category));
    } else {
      params.delete('categoryId');
    }

    navigate({
      pathname: '/shop',
      search: `?${params.toString()}`,
    });
  };

  const isShopPage = location.pathname === '/shop' || location.pathname.startsWith('/shop/');
  const { data: wishlistCount } = useWishlistCount();
  const { t } = useTranslation('common');

  const authButtons = (isDarkMode = true, onAfterClick?: () => void) => (
    <>
      {isAuthenticated && (
        <Button
          fullWidth
          appearance="link"
          color={isDarkMode ? 'light' : 'primary'}
          onClick={() => {
            navigate('/orders-history');
            onAfterClick?.();
          }}
        >
          {t('nav.orders')}
        </Button>
      )}
      <AuthButtonsWithDialogs isDarkMode={isDarkMode} onAfterClick={onAfterClick}/>
    </>
  );

  return (
    <header className={styles.header}>
      <Flex className={styles.headerAnnouncement} align="center" justify="between" spacing="xxl">
        <Flex spacing="m">
          <Icon icon={faTruckFast} color={IconColor.light}/>
          <span>{t('nav.welcome')}</span>
        </Flex>
        <Flex align="center" spacing="s" className="bts-hideOnMobile">
          {authButtons(true)}
          <LanguageSwitcher/>
        </Flex>
        <BurgerMenu authButtons={(onClose) => authButtons(false, onClose)}/>
      </Flex>

      <Flex className={styles.headerMain} justify="stretch" align="center" fullWidth spacing="xl">
        <div className="bts-hideOnMobile">
          <img
            src="/assets/kit-images/logo.png"
            alt="logo"
            className={styles.headerLogo}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        </div>

        <div className={styles.headerSearch}>
          <SearchInputWithUrl/>
        </div>

        <Flex align="center">
          <Button
            appearance="link"
            size="xlarge"
            withoutPadding
            iconBadge={cartCount ?? 0}
            leftIcon={faShoppingCart}
            onClick={() => navigate('/shopping-cart')}
          />
          <Button
            appearance="link"
            size="xlarge"
            withoutPadding
            color="secondary"
            leftIcon={faHeart}
            iconBadge={wishlistCount ?? 0}
            onClick={() => navigate('/wish-list')}
          />
        </Flex>
      </Flex>

      {!isShopPage && (
        <div className={clsx('bts-paddingLxl bts-paddingRxl', styles.headerCategoriesContainer)}>
          <Flex
            fullWidth
            spacing="xxxl"
            justify="center"
            align="center"
            className={clsx(styles.headerCategories, 'bts-hideScrollbar')}
          >
            <Button
              size="large"
              withoutPadding
              appearance="link"
              onClick={() => handleCategoryClick()}
            >
              {t('shop.all', { defaultValue: 'All' })}
            </Button>
            {categories.map(({ name, id }) => (
              <Button
                withoutPadding
                key={name}
                size="large"
                appearance="link"
                onClick={() => handleCategoryClick(id)}
              >
                {name}
              </Button>
            ))}
          </Flex>
        </div>
      )}
    </header>
  );
};

export default Header;
