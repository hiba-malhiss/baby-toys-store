import styles from './header.module.scss';
import Flex from '../Flex/Flex.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { Nav } from '../../common/Nav/Nav.tsx';
import { Button } from '../../common/Button/Button.tsx';
import { Input } from '../../common/Input/Input.tsx';

const navConfig = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
];

const Header = () => {
  return (
    <header className={styles.header}>
      <Flex className={styles.headerAnnouncement} align="center" justify="between" spacing="xxl">
        <Flex spacing="m" className={styles.headerFreeChipping}>
          <FontAwesomeIcon icon={faTruckFast} />
          <span>Free free shipping with over $150</span>
        </Flex>
        <Flex spacing="xxxxl">
          <Button withoutPadding appearance="light-link">
            Login
          </Button>
          <Button withoutPadding appearance="light-link">
            Register
          </Button>
        </Flex>
      </Flex>
      <Flex className={styles.headerMain} justify="between" align="center" wrap fullWidth>
        <img src="/assets/images/logo.png" alt="logo" className={styles.headerLogo} />
        <Nav config={navConfig} />
        <Input isSearch placeholder="Search" />
      </Flex>
    </header>
  );
};

export default Header;
