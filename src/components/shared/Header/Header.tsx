import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './header.module.scss';
import { faHeart, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { IconColor } from '../../common/Icon/icon.constant';
import Flex from '../../common/Flex/Flex.tsx';
import { Icon } from '../../common/Icon/Icon.tsx';
import { CartButton } from '../../common/CartButton/CartButton.tsx';
import { useCartStore } from '../../../store/useCartStore.ts';
import AuthButtonsWithDialogs from './AuthButtons.tsx';
import { useAuth } from '../../../context/AuthContext';
import { useStoreConfiguration } from '../../../context/StoreConfigurationContext';
import { getProductCategories } from '../../../mock-data/useMockProductsApi.ts';
import { Button } from '../../common/Button/Button.tsx';
import SearchInputWithUrl from './SearchInputWithUrl.tsx';

const Header = () => {
  const { getTotalItemsInCart } = useCartStore();
  const [categories, setCategories] = useState<any[]>([]);
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

  return (
    <header className={styles.header}>
      <Flex className={styles.headerAnnouncement} align="center" justify="between" spacing="xxl">
        <Flex spacing="m" className={styles.headerFreeChipping}>
          <Icon icon={faTruckFast} color={IconColor.light} />
          <span>{shipping?.headerMessage}</span>
        </Flex>
        <Flex spacing="xxxxl">
          {isLoggedIn && (
            <Button
              withoutPadding
              appearance="link"
              color="light"
              onClick={() => navigate('/orders-history')}
            >
              My Orders
            </Button>
          )}
          <AuthButtonsWithDialogs />
        </Flex>
      </Flex>

      <Flex className={styles.headerMain} justify="stretch" align="center" wrap fullWidth>
        <img
          src="/assets/images/logo.png"
          alt="logo"
          className={styles.headerLogo}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />

        <div className={styles.headerSearch}>
          <SearchInputWithUrl />
        </div>

        <Flex spacing="xl" align="center">
          <CartButton itemCount={getTotalItemsInCart()} />
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
        <Flex fullWidth spacing="xxxl" wrap justify="center" align="center">
          <Button
            size="large"
            withoutPadding
            appearance="link"
            onClick={() => handleCategoryClick()}
          >
            All Toys
          </Button>
          {categories.map(({ label, value }) => (
            <Button
              withoutPadding
              key={label}
              size="large"
              appearance="link"
              onClick={() => handleCategoryClick(value)}
            >
              {label}
            </Button>
          ))}
        </Flex>
      )}
    </header>
  );
};

export default Header;
