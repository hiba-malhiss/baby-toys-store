import styles from './header.module.scss';
import { faSearch, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { Nav } from '../../common/Nav/Nav.tsx';
import { Button } from '../../common/Button/Button.tsx';
import { StringInput } from '../../common/StringInput/StringInput.tsx';
import Flex from '../../common/Flex/Flex.tsx';
import { Icon } from '../../common/Icon/Icon.tsx';

const navConfig = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
];

const Header = () => {
  const isActivePath = (navPath: string, currentPath: string) => {
    if (navPath === '/') {
      return currentPath === '/';
    }
    if (navPath === '/shop') {
      return currentPath === '/shop' || currentPath.startsWith('/product-details/');
    }
    return currentPath === navPath || currentPath.startsWith(navPath + '/');
  };

  return (
    <header className={styles.header}>
      <Flex className={styles.headerAnnouncement} align="center" justify="between" spacing="xxl">
        <Flex spacing="m" className={styles.headerFreeChipping}>
          <Icon icon={faTruckFast} color="light" />
          <span>Free free shipping with over $150</span>
        </Flex>
        <Flex spacing="xxxxl">
          <Button withoutPadding appearance="link" color="light">
            Login
          </Button>
          <Button withoutPadding appearance="link" color="light">
            Register
          </Button>
        </Flex>
      </Flex>
      <Flex className={styles.headerMain} justify="between" align="center" wrap fullWidth>
        <img src="/assets/images/logo.png" alt="logo" className={styles.headerLogo} />
        <Nav config={navConfig} isActivePath={isActivePath} />
        <StringInput
          placeholder="Search"
          icon={faSearch}
          isRounded
          withIconBackground
          iconColor="light"
          iconPosition="right"
        />
      </Flex>
    </header>
  );
};

export default Header;
