import { useNavigate } from 'react-router-dom';
import styles from './shop-now-section.module.scss';
import { Button, Carousel } from '@baby-toys/ui-kit';
import { useIsRtl } from '../../../utils/i18n';
import { useHomePageContent } from '../../../api/homepageApi';
import { getFlexJustify, getFlexVertical } from '../homePage.helpers.ts';
import { getAppLocale } from '../../../components/i18n/locale.ts';

const ShopNowSection = () => {
  const navigate = useNavigate();
  const isRtl = useIsRtl();
  const { data, isLoading } = useHomePageContent();

  if (isLoading || !data?.mainBanners?.length) return null;

  const currentLocale = getAppLocale();
  const banner = data.mainBanners.find((b) => b.locale === currentLocale);
  if (!banner) return null;
  const images: string[] = banner.imagesUrl || [];
  if (!images.length) return null;

  const handleShopNow = () => {
    navigate('/shop');
  };

  return (
    <div className={styles.shopNowSectionImageContainer} style={{ position: 'relative' }}>
      <Carousel
        items={images}
        className={styles.shopNowSectionCarousel}
        appearance="auto-play"
        itemTemplate={(url: string) => (
          <img
            src={url}
            alt="main banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: getFlexJustify(banner.alignment, isRtl),
          justifyContent: getFlexVertical(banner.verticalAlignment),
          padding: '40px',
        }}
      >
        {banner.title && <span className={styles.shopNowSectionTitle}>{banner.title}</span>}
        {banner.subtitle && (
          <span className={styles.shopNowSectionSubTitle}>{banner.subtitle}</span>
        )}
        {banner.ctaText && (
          <Button size="xxlarge" appearance="filled" color="accent" onClick={handleShopNow}>
            {banner.ctaText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShopNowSection;
