import { Flex } from '@baby-toys/ui-kit';
import styles from './banners-section.module.scss';
import clsx from 'clsx';
import { useHomePageContent } from '../../../api/homepageApi';
import type { HeroBannerDto } from '../../../api/types/homepage';

const BannersSection = () => {
  const { data, isLoading } = useHomePageContent();
  const heroBanners = (data?.heroBanners || []) as HeroBannerDto[];

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
        justify="end"
        className={clsx(styles.bannerWrapper, styles.bannerWrapperTopRight)}
      >
        <p>{heroBanners[1]?.text || ''}</p>
      </Flex>
    </Flex>
  );
};

export default BannersSection;
