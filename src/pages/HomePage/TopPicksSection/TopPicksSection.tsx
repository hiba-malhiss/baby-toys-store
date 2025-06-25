import { useState } from 'react';
import Section from '../../../components/layout/Section/Section.tsx';
import RadioButtonGroup from '../../../components/common/RadioButtonGroup/RadioButtonGroup.tsx';
import { topPicksRadioOptions } from '../../../mock-data/home-page.ts';
import styles from './top-picks-section.module.scss';
import SmartProductCard from '../../../components/smart/SmartProductCard/SmartProductCard.tsx';
import { toys } from '../../../mock-data/toy-card-list.ts';

const TopPicksSection = () => {
  const [selected, setSelected] = useState(topPicksRadioOptions[0].value); // e.g., "featured"

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
        {toys.map((toy, index) => (
          <SmartProductCard key={index} product={toy} />
        ))}
      </div>
    </Section>
  );
};

export default TopPicksSection;
