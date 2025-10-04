import { Flex } from '@baby-toys/ui-kit';
import styles from './banners-section.module.scss';
import clsx from 'clsx';
import { useHomePageContent } from '../../../api/homepageApi';
import type { HeroBannerDto } from '../../../api/types/homepage';
import { useIsRtl } from '../../../utils/i18n.ts';

const BannersSection = () => {
  const { data, isLoading } = useHomePageContent();
  const heroBanners = (data?.heroBanners || []) as HeroBannerDto[];
  const isRtl = useIsRtl();

  if (isLoading || heroBanners.length === 0) return null;

  return (
    <Flex spacing="xxl" fullWidth className={styles.banner} wrap justify="center">
      <Flex
        align="center"
        justify="center"
        className={clsx(styles.bannerWrapper, styles.bannerWrapperCenter)}
      >
        <p>{heroBanners[0]?.text || ''}</p>
      </Flex>
      <Flex
        align="center"
        justify={isRtl ? 'start' : 'end'}
        className={clsx(styles.bannerWrapper, styles.bannerWrapperTopRight)}
      >
        <p>{heroBanners[1]?.text || ''}</p>
      </Flex>
    </Flex>
  );
};

export default BannersSection;
