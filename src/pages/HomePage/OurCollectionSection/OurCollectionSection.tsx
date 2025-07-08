import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './our-collection-section.module.scss';
import Flex from '../../../components/common/Flex/Flex.tsx';
import { Button } from '../../../components/common/Button/Button.tsx';
import Section from '../../../components/shared/Section/Section.tsx';
import { getProductCategories } from '../../../mock-data/useMockProductsApi.ts';

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
        {categories.map(({ label, image, value }) => (
          <Button
            withoutPadding
            key={label}
            withAutoHeight
            appearance="link"
            size="large"
            onClick={() => handleCategoryClick(value)}
          >
            <Flex fullHeight direction="vertical" align="center" justify="between" spacing="xl">
              <img src={image} alt={label} className={styles.ourCollectionImage} />
              <span>{label}</span>
            </Flex>
          </Button>
        ))}
      </Flex>
    </Section>
  );
};

export default OurCollectionSection;
