import { useEffect, useState } from 'react';
import { Flex } from '@baby-toys/ui-kit/components';

import styles from './banners-section.module.scss';
import { useMockProductsApi } from '../../../mock-data/useMockProductsApi.ts';
import clsx from 'clsx';

const BannersSection = () => {
  const [banners, setBanners] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getHomepageContent } = useMockProductsApi(10);

  useEffect(() => {
    setIsLoading(true);
    getHomepageContent()
      .then((data) => setBanners(data.banners))
      .finally(() => setIsLoading(false));
  }, [getHomepageContent]);

  if (isLoading) {
    return null;
  }

  return (
    <Flex spacing="xxl" fullWidth className={styles.banner} wrap justify="center">
      <Flex
        align="center"
        justify="center"
        className={clsx(styles.bannerWrapper, styles.bannerWrapperCenter)}
      >
        <p>{banners[0] || ''}</p>
      </Flex>
      <Flex
        align="center"
        justify="end"
        className={clsx(styles.bannerWrapper, styles.bannerWrapperTopRight)}
      >
        <p>{banners.slice(1).join(', ')}</p>
      </Flex>
    </Flex>
  );
};

export default BannersSection;
