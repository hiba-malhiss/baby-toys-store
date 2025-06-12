import { useState } from 'react';
import Section from '../../../components/layout/Section/Section.tsx';
import RadioButtonGroup from '../../../components/commmon/RadioButtonGroup/RadioButtonGroup.tsx';
import { topPicksRadioOptions } from '../home-page.constants.ts';
import styles from './top-picks-section.module.scss';
import MockToyCardList from '../../../components/commmon/ToyCardList/MockToyCardList.tsx';

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
      <MockToyCardList />
    </Section>
  );
};

export default TopPicksSection;
