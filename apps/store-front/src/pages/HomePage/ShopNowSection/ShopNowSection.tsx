import { useNavigate } from 'react-router-dom';
import styles from './shop-now-section.module.scss';
import { Flex, Button } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';
import { useIsRtl } from '../../../utils/i18n';

const ShopNowSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const isRtl = useIsRtl();

  const handleShopNow = () => {
    navigate('/shop');
  };

  return (
    <Flex
      className={styles.shopNowSectionImageContainer}
      direction="vertical"
      justify="center"
      align={isRtl ? 'center' : 'end'}
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
