import { Flex, Image } from '@baby-toys/ui-kit';
import Section from '../../../components/features/Section/Section.tsx';
import { useHomePageContent } from '../../../api/homepageApi';
import type { GalleryImageDto } from '../../../api/types/homepage';
import styles from './recent-photo-shoots-section.module.scss';

const RecentPhotoShoots = () => {
  const { data, isPending } = useHomePageContent();
  const gallery = (data?.galleryImages || []) as GalleryImageDto[];

  return (
    <Section
      title="Recent photo Shoots"
      subTitle="Check gallery"
      compactPadding
      isLoading={isPending}
    >
      <Flex wrap justify="center">
        {gallery.map((img, index) => (
          <div key={img.imageUrl ?? index} className={styles.recentPhotoShootsImageWrapper}>
            <Image src={img.imageUrl} alt={img.caption} className={styles.recentPhotoShootsImage} />
          </div>
        ))}
      </Flex>
    </Section>
  );
};

export default RecentPhotoShoots;
