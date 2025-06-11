import styles from './header.module.scss';
import Flex from '../Flex/Flex.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVanShuttle } from '@fortawesome/free-solid-svg-icons';
import { Nav } from '../../commmon/Nav/Nav.tsx';
import { Button } from '../../commmon/Button/Button.tsx';
import { Input } from '../../commmon/Input/Input.tsx';

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
        <Flex spacing="m">
          <FontAwesomeIcon icon={faVanShuttle} />
          <span>Free free shipping with over $150</span>
        </Flex>
        <Flex spacing="xxxl">
          <Button withoutPadding appearance="link-light">
            Login
          </Button>
          <Button withoutPadding appearance="link-light">
            Register
          </Button>
        </Flex>
      </Flex>
      <Flex className={styles.headerMain} justify="between" align="center">
        <img src="/assets/images/logo.png" alt="logo" className={styles.headerLogo} />
        <Nav config={navConfig} />
        <Input isSearch placeholder="Search" />
      </Flex>
    </header>
  );
};

export default Header;
