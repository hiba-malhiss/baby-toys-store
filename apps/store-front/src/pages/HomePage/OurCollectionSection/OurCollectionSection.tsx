import { useNavigate } from 'react-router-dom';
import styles from './our-collection-section.module.scss';
import { Flex, Button } from '@baby-toys/ui-kit';
import Section from '../../../components/features/Section/Section.tsx';
import { useCategories } from '../../../api/catalogApi.ts';
import { useTranslation } from 'react-i18next';

const OurCollectionSection = () => {
  const { data: categories = [], isLoading } = useCategories();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const handleCategoryClick = (category: string) => {
    // Navigate to shop page with category filter
    navigate(`/shop?categoryId=${encodeURIComponent(category)}`);
  };

  return (
    <Section
      title={t('home.collection.title')}
      subTitle={t('home.collection.subtitle')}
      className={styles.ourCollection}
      isLoading={isLoading}
    >
      <Flex
        fullWidth
        align="stretch"
        justify="center"
        className={styles.ourCollectionCategories}
        wrap
      >
        {categories
          .filter((cat) => cat.isMain)
          .map((cat: any) => (
            <Button
              withoutPadding
              key={cat.name}
              withAutoHeight
              appearance="link"
              size="large"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <Flex fullHeight direction="vertical" align="center" justify="between" spacing="xl">
                <img
                  src={cat.imageUrl || '/assets/educational-toys.svg'}
                  alt={cat.name}
                  className={styles.ourCollectionImage}
                />
                <span>{cat.name}</span>
              </Flex>
            </Button>
          ))}
      </Flex>
    </Section>
  );
};

export default OurCollectionSection;
