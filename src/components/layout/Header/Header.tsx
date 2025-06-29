import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './header.module.scss';
import { faSearch, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { Nav } from '../../common/Nav/Nav.tsx';
import { StringInput } from '../../common/StringInput/StringInput.tsx';
import Flex from '../../common/Flex/Flex.tsx';
import { Icon } from '../../common/Icon/Icon.tsx';
import { CartButton } from '../../common/CartButton/CartButton.tsx';
import { useCartStore } from '../../../store/useCartStore.ts';
import AuthButtonsWithDialogs from './AuthButtons.tsx';

const navConfig = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
];

const Header = () => {
  const { getTotalItemsInCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const isActivePath = (navPath: string, currentPath: string) => {
    if (navPath === '/') {
      return currentPath === '/';
    }
    if (navPath === '/shop') {
      return currentPath === '/shop' || currentPath.startsWith('/product-details/');
    }
    return currentPath === navPath || currentPath.startsWith(navPath + '/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSearchInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className={styles.header}>
      <Flex className={styles.headerAnnouncement} align="center" justify="between" spacing="xxl">
        <Flex spacing="m" className={styles.headerFreeChipping}>
          <Icon icon={faTruckFast} color="light" />
          <span>Free shipping with over 150</span> // add currancy
        </Flex>
        <AuthButtonsWithDialogs />
      </Flex>
      <Flex className={styles.headerMain} justify="between" align="center" wrap fullWidth>
        <img
          src="/assets/images/logo.png"
          alt="logo"
          className={styles.headerLogo}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        <Nav config={navConfig} isActivePath={isActivePath} />
        <Flex spacing="xxxl" align="center">
          <CartButton itemCount={getTotalItemsInCart()} />
          <form onSubmit={handleSearch}>
            <StringInput
              placeholder="Search products..."
              icon={faSearch}
              isRounded
              withIconBackground
              iconColor="light"
              iconPosition="right"
              value={searchQuery}
              onChange={(value: any) => setSearchQuery(value)}
              onKeyDown={(value: any) => handleSearchInputKeyDown(value)}
            />
          </form>
        </Flex>
      </Flex>
    </header>
  );
};

export default Header;
