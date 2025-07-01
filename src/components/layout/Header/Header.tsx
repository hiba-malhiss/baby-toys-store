import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './header.module.scss';
import { faHeart, faSearch, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import Flex from '../../common/Flex/Flex.tsx';
import { Icon } from '../../common/Icon/Icon.tsx';
import { CartButton } from '../../common/CartButton/CartButton.tsx';
import { useCartStore } from '../../../store/useCartStore.ts';
import AuthButtonsWithDialogs from './AuthButtons.tsx';
import { useStoreConfiguration } from '../../../context/StoreConfigurationContext';
import { IconColor } from '../../common/Icon/icon.constant.ts';
import { getProductCategories } from '../../../mock-data/useMockProductsApi.ts';
import { Button } from '../../common/Button/Button.tsx';
import { StringInputWithButton } from '../../common/StringInputWithButton/StringInputWithButton.tsx';

const Header = () => {
  const { getTotalItemsInCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { shipping } = useStoreConfiguration();

  useEffect(() => {
    getProductCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (category?: string) => {
    if (!category) {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${encodeURIComponent(category)}`);
    }
  };

  const handleSearchInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Determine if current path is shop page or a subpage of it
  const isShopPage = location.pathname === '/shop' || location.pathname.startsWith('/shop/');

  return (
    <header className={styles.header}>
      <Flex className={styles.headerAnnouncement} align="center" justify="between" spacing="xxl">
        <Flex spacing="m" className={styles.headerFreeChipping}>
          <Icon icon={faTruckFast} color="light" />
          <span>{shipping?.message}</span>
        </Flex>
        <AuthButtonsWithDialogs />
      </Flex>

      <Flex className={styles.headerMain} justify="stretch" align="center" wrap fullWidth>
        <img
          src="/assets/images/logo.png"
          alt="logo"
          className={styles.headerLogo}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />

        <form
          onSubmit={handleSearch}
          aria-label="Product Search Form"
          className={styles.headerSearch}
        >
          <StringInputWithButton
            placeholder="Search products..."
            buttonIcon={faSearch}
            fullWidth
            value={searchQuery}
            onChange={(value: any) => setSearchQuery(value)}
            onKeyDown={handleSearchInputKeyDown}
            onClick={handleSearchInputKeyDown}
          />
        </form>

        <Flex spacing="xl" align="center">
          <CartButton itemCount={getTotalItemsInCart()} />
          <Icon icon={faHeart} color={IconColor.grayDark} size="xlarge" />
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
