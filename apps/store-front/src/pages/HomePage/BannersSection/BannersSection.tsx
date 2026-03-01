import styles from './banners-section.module.scss';
import clsx from 'clsx';
import { useHomePageContent } from '../../../api/homepageApi';
import type { BannerDto } from '../../../api/types/homepage';
import { useIsRtl } from '../../../utils/i18n';
import { getFlexJustify, getFlexVertical } from '../homePage.helpers.ts';
import { getAppLocale } from '../../../components/i18n/locale.ts';

const BannersSection = () => {
  const { data, isLoading } = useHomePageContent();
  const banners = (data?.banners || []) as BannerDto[];
  const isRtl = useIsRtl();

  if (isLoading || banners.length === 0) return null;

  const currentLocale = getAppLocale();
  const localized = banners.filter((b) => b.locale === currentLocale);

  return (
    <div className={styles.banner}>
      {localized.map((banner, index) => (
        <div
          key={index}
          className={clsx(
            styles.bannerWrapper,
            banner.alignment && styles[`align-${banner.alignment.toLowerCase()}`]
          )}
          style={{
            ['--bg-image' as any]: `url(${banner.imageUrl})`,
            alignItems: getFlexVertical(banner.verticalAlignment),
            justifyContent: getFlexJustify(banner.alignment, isRtl),
          }}
        >
          <p>{banner.text}</p>
        </div>
      ))}
    </div>
  );
};

export default BannersSection;
