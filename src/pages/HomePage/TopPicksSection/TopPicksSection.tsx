import { useState } from 'react';
import Section from '../../../components/layout/Section/Section.tsx';
import RadioButtonGroup from '../../../components/common/RadioButtonGroup/RadioButtonGroup.tsx';
import { topPicksRadioOptions } from '../home-page.constants.ts';
import styles from './top-picks-section.module.scss';
import ToyCard from '../../../components/common/ToyCard/ToyCard.tsx';
import type { Toy } from '../../../types/toy.types.ts';
import { toys } from '../../../mock-data/toy-card-list.ts';

const TopPicksSection = () => {
  const [selected, setSelected] = useState(topPicksRadioOptions[0].value); // e.g., "featured"
  const [toysState, setToysState] = useState(toys);

  const toggleFavorite = (index: number) => {
    setToysState((prev) =>
      prev.map((toy: Toy, i: number) =>
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
          <ToyCard key={index} toy={toy} onToggleFavorite={() => toggleFavorite(index)} />
        ))}
      </div>
    </Section>
  );
};

export default TopPicksSection;
