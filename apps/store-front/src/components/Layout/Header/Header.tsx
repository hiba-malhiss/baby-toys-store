import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { faHeart, faShoppingCart, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { Icon, IconColor, Flex, Button } from '@baby-toys/ui-kit/components';
import styles from './header.module.scss';
import SearchInputWithUrl from './SearchInputWithUrl.tsx';
import AuthButtonsWithDialogs from './AuthButtons.tsx';
import { useCartStore } from '../../../store/useCartStore.ts';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useStoreConfiguration } from '../../../context/StoreConfigurationContext.tsx';
import { getProductCategories } from '@mock-data/useMockApi';
import type { Category } from '@baby-toys/types';
import clsx from 'clsx';
import BurgerMenu from './BurgerMenu.tsx';

const Header = () => {
  const { getTotalItemsInCart } = useCartStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { shipping } = useStoreConfiguration();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    getProductCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  const handleCategoryClick = (category?: string) => {
    const params = new URLSearchParams(location.search);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    navigate({
      pathname: '/shop',
      search: `?${params.toString()}`,
    });
  };

  const isShopPage = location.pathname === '/shop' || location.pathname.startsWith('/shop/');

  const authButtons = (isDarkMode = true, onAfterClick?: () => void) => (
    <>
      {isLoggedIn && (
        <Button
          fullWidth
          appearance="link"
          color={isDarkMode ? 'light' : 'primary'}
          onClick={() => {
            navigate('/orders-history');
            onAfterClick?.();
          }}
        >
          My Orders
        </Button>
      )}
      {isLoggedIn && (
        <Button
          fullWidth
          appearance="link"
          color={isDarkMode ? 'light' : 'primary'}
          onClick={() => {
            navigate('/admin');
            onAfterClick?.();
          }}
        >
          Admin
        </Button>
      )}
      <AuthButtonsWithDialogs isDarkMode={isDarkMode} onAfterClick={onAfterClick} />
    </>
  );

  return (
    <header className={styles.header}>
      <Flex className={styles.headerAnnouncement} align="center" justify="between" spacing="xxl">
        <Flex spacing="m">
          <Icon icon={faTruckFast} color={IconColor.light} />
          <span>{shipping?.headerMessage}</span>
        </Flex>
        <div className="bts-hideOnMobile">
          <Flex spacing="xxxxl">{authButtons(true)}</Flex>
        </div>
        <BurgerMenu authButtons={(onClose) => authButtons(false, onClose)} />
      </Flex>

      <Flex className={styles.headerMain} justify="stretch" align="center" wrap fullWidth>
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
          <SearchInputWithUrl />
        </div>

        <Flex spacing="xl" align="center">
          <Button
            appearance="link"
            size="xlarge"
            withoutPadding
            iconColor={IconColor.grayDark}
            iconBadge={getTotalItemsInCart()}
            leftIcon={faShoppingCart}
            onClick={() => navigate('/shopping-cart')}
          />
          <Button
            appearance="link"
            size="xlarge"
            withoutPadding
            color="secondary"
            leftIcon={faHeart}
            onClick={() => navigate('/wish-list')}
          />
        </Flex>
      </Flex>

      {!isShopPage && (
        <div className={clsx('bts-paddingLs bts-paddingRs')}>
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
              All Toys
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
