import { useState, useEffect } from 'react';
import Section from '../../../components/layout/Section/Section.tsx';
import Flex from '../../../components/common/Flex/Flex.tsx';
import styles from './recent-photo-shoots-section.module.scss';
import { useMockProductsApi } from '../../../mock-data/useMockProductsApi.ts';

const RecentPhotoShoots = () => {
  const [photoShoots, setPhotoShoots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { getHomepageContent } = useMockProductsApi(10);

  useEffect(() => {
    getHomepageContent()
      .then(({ photoShoots }) => {
        setPhotoShoots(photoShoots);
      })
      .catch((error) => {
        console.error('Error fetching photo shoots:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getHomepageContent]);

  return (
    <Section
      title="Recent photo Shoots"
      subTitle="Check gallery"
      compactPadding
      isLoading={loading}
    >
      <Flex wrap justify="center">
        {photoShoots.map((src, index) => (
          <div key={index} className={styles.recentPhotoShootsImageWrapper}>
            <img
              src={src}
              alt={`Photo shoot ${index + 1}`}
              className={styles.recentPhotoShootsImage}
            />
          </div>
        ))}
      </Flex>
    </Section>
  );
};

export default RecentPhotoShoots;
