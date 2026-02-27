import { useNavigate } from 'react-router-dom';
import styles from './shop-now-section.module.scss';
import { Button } from '@baby-toys/ui-kit';
import { useIsRtl } from '../../../utils/i18n';
import { useHomePageContent } from '../../../api/homepageApi';
import { getFlexAlignment, getFlexJustify } from '../homePage.helpers.ts';
import { getAppLocale } from '../../../components/i18n/locale.ts';

const ShopNowSection = () => {
  const navigate = useNavigate();
  const isRtl = useIsRtl();
  const { data, isLoading } = useHomePageContent();

  if (isLoading || !data?.mainBanners?.length) return null;

  const currentLocale = getAppLocale();
  const banner = data.mainBanners.find((b) => b.locale === currentLocale);
  if (!banner) return null;

  const handleShopNow = () => {
    navigate('/shop');
  };

  return (
    <div
      className={styles.shopNowSectionImageContainer}
      style={{
        ['--bg-image' as any]: `url(${banner.imageUrl})`,
        alignItems: getFlexAlignment(banner.alignment, isRtl),
        justifyContent: getFlexJustify(banner.alignment, 'CENTER', isRtl),
      }}
    >
      {banner.title && <span className={styles.shopNowSectionTitle}>{banner.title}</span>}

      {banner.subtitle && <span className={styles.shopNowSectionSubTitle}>{banner.subtitle}</span>}

      {banner.ctaText && (
        <Button size="xxlarge" appearance="filled" color="accent" onClick={handleShopNow}>
          {banner.ctaText}
        </Button>
      )}
    </div>
  );
};

export default ShopNowSection;
