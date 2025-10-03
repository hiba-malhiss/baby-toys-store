import { useNavigate } from 'react-router-dom';
import styles from './shop-now-section.module.scss';
import { Flex, Button } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';

const ShopNowSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('common');

  const handleShopNow = () => {
    navigate('/shop');
  };

  return (
    <Flex
      className={styles.shopNowSectionImageContainer}
      direction="vertical"
      justify="center"
      align="end"
    >
      <Flex direction="vertical" className={styles.shopNowSectionContent}>
        <span className={styles.shopNowSectionTitle}>{t('home.shopNow.title')}</span>
        <span className={styles.shopNowSectionSubTitle}>{t('home.shopNow.subtitle')}</span>
        <Button size="xxlarge" appearance="filled" color="accent" onClick={handleShopNow}>
          {t('home.shopNow.cta')}
        </Button>
      </Flex>
    </Flex>
  );
};

export default ShopNowSection;
