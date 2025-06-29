import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './our-collection-section.module.scss';
import Flex from '../../../components/common/Flex/Flex.tsx';
import { Button } from '../../../components/common/Button/Button.tsx';
import Section from '../../../components/layout/Section/Section.tsx';
import { useMockProductsApi } from '../../../mock-data/useMockProductsApi.ts';
import type { ProductCategory } from '../../../types/product.types.ts';

const OurCollectionSection = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getCategories } = useMockProductsApi(10);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error) => {
        console.error('Error fetching categories:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getCategories]);

  const handleCategoryClick = (categoryLabel: string) => {
    // Navigate to shop page with category filter
    navigate(`/shop?category=${encodeURIComponent(categoryLabel)}`);
  };

  if (loading) {
    return (
      <Section
        title="Find The Perfect Toy"
        subTitle="Our Collections"
        className={styles.ourCollection}
      >
        <div>Loading categories...</div>
      </Section>
    );
  }

  return (
    <Section
      title="Find The Perfect Toy"
      subTitle="Our Collections"
      className={styles.ourCollection}
    >
      <Flex
        fullWidth
        align="stretch"
        justify="center"
        className={styles.ourCollectionCategories}
        wrap
      >
        {categories.map(({ label, image }) => (
          <Button
            withoutPadding
            key={label}
            withoutAutoHeight
            appearance="link"
            size="large"
            onClick={() => handleCategoryClick(label)}
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