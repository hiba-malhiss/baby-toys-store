import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './our-collection-section.module.scss';
import { Flex, Button } from '@baby-toys/ui-kit';
import Section from '../../../components/features/Section/Section.tsx';
import { getProductCategories } from '@mock-data/useMockApi';

const OurCollectionSection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProductCategories()
      .then((data) => {
        setCategories(data.filter((cat: any) => cat.image));
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (category: string) => {
    // Navigate to shop page with category filter
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <Section
      title="Find The Perfect Toy"
      subTitle="Our Collections"
      className={styles.ourCollection}
      isLoading={loading}
    >
      <Flex
        fullWidth
        align="stretch"
        justify="center"
        className={styles.ourCollectionCategories}
        wrap
      >
        {categories.map(({ name, image, id }) => (
          <Button
            withoutPadding
            key={name}
            withAutoHeight
            appearance="link"
            size="large"
            onClick={() => handleCategoryClick(id)}
          >
            <Flex fullHeight direction="vertical" align="center" justify="between" spacing="xl">
              <img src={image} alt={name} className={styles.ourCollectionImage} />
              <span>{name}</span>
            </Flex>
          </Button>
        ))}
      </Flex>
    </Section>
  );
};

export default OurCollectionSection;
