import { useState } from 'react';
import { Heart, Menu, ShoppingBag } from 'lucide-react';
import { Button, Divider, Drawer, Flex } from '@baby-toys/ui-kit';
import styles from './header.module.scss';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../../i18n/LanguageSwitcher.tsx';
import { useWishlistCount } from '../../../api/wishlistApi.ts';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext.tsx';
import AuthButtonsWithDialogs from './AuthButtons.tsx';
import { useLogo } from '../../../hooks/useLogo.ts';

const BurgerMenu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data: wishlistCount } = useWishlistCount();
  const { t } = useTranslation('common');
  const logoUrl = useLogo();
  const { isAuthenticated } = useAuth();

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
        size="xlarge"
        withoutPadding
        color="secondary"
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
            src={logoUrl}
            alt="logo"
            className={styles.headerLogo}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        }
        footer={<AuthButtonsWithDialogs isLink={false} onAfterClick={toggleMenu} isVertical />}
      >
        <Flex direction="vertical" spacing="s">
          <Button
            appearance="link"
            size="large"
            withoutPadding
            leftIconComp={Heart}
            iconBadge={wishlistCount ?? 0}
            onClick={() => navigate('/wish-list')}
          >
            {t('wishlist.header')}
          </Button>
          {isAuthenticated && (
            <Button
              appearance="link"
              size="large"
              withoutPadding
              leftIconComp={ShoppingBag}
              onClick={() => {
                navigate('/orders-history');
              }}
            >
              {t('nav.orders')}
            </Button>
          )}
          <Divider className="bts-marginBl" />
          <Flex spacing="s" align="center">
            {t('language.label')}
            <LanguageSwitcher />
          </Flex>
        </Flex>
      </Drawer>
    </div>
  );
};

export default BurgerMenu;
