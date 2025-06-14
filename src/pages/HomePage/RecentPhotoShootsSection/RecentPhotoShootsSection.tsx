import Section from '../../../components/layout/Section/Section.tsx';
import Flex from '../../../components/layout/Flex/Flex.tsx';
import { photoShoots } from '../../../mock-data/home-page.ts';
import styles from './recent-photo-shoots-section.module.scss';

const RecentPhotoShoots = () => {
  return (
    <Section title="Recent photo Shoots" subTitle="Check gallery" compactPadding>
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
