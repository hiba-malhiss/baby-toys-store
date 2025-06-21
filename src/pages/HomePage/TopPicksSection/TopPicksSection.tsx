import { useState } from 'react';
import Section from '../../../components/layout/Section/Section.tsx';
import RadioButtonGroup from '../../../components/common/RadioButtonGroup/RadioButtonGroup.tsx';
import { topPicksRadioOptions } from '../../../mock-data/home-page.ts';
import styles from './top-picks-section.module.scss';
import ProductCard from '../../../components/common/ProductCard/ProductCard.tsx';
import type { Product } from '../../../types/product.types.ts';
import { toys } from '../../../mock-data/toy-card-list.ts';
import { useNavigate } from 'react-router-dom';

const TopPicksSection = () => {
  const [selected, setSelected] = useState(topPicksRadioOptions[0].value); // e.g., "featured"
  const [toysState, setToysState] = useState(toys);
  const navigate = useNavigate();

  const toggleFavorite = (index: number) => {
    setToysState((prev) =>
      prev.map((toy: Product, i: number) =>
        i === index ? { ...toy, isFavorite: !toy.isFavorite } : toy
      )
    );
  };

  return (
    <Section title="Top picks for your little ones">
      <RadioButtonGroup
        className={styles.topPicks}
        options={topPicksRadioOptions}
        selectedValue={selected}
        name="topPicks"
        onChange={setSelected}
      />
      <div className={styles.topPicksGrid}>
        {toysState.map((toy, index) => (
          <ProductCard
            key={index}
            product={toy}
            onToggleFavorite={() => toggleFavorite(index)}
            onClick={(product) => navigate(`/product-details/${product.id}`)}
          />
        ))}
      </div>
    </Section>
  );
};

export default TopPicksSection;
