import { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Button, Drawer, Flex } from '@baby-toys/ui-kit';
import styles from './header.module.scss';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../../i18n/LanguageSwitcher.tsx';

interface BurgerMenuProps {
  authButtons: (onClose: () => void) => ReactNode;
}

const BurgerMenu = ({ authButtons }: BurgerMenuProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.burgerMenu}>
      <Button
        appearance="link"
        color="light"
        size="large"
        leftIconComp={Menu}
        onClick={toggleMenu}
        className={styles.burgerIcon}
      ></Button>
      <Drawer
        visible={isOpen}
        onClose={handleClose}
        position="right"
        appendTo={document.body}
        header={
          <img
            src="/assets/kit-images/logo.png"
            alt="logo"
            className={styles.headerLogo}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        }
      >
        <Flex align="center" direction="vertical" spacing="s">
          <LanguageSwitcher />
          {authButtons(handleClose)}
        </Flex>
      </Drawer>
    </div>
  );
};

export default BurgerMenu;
