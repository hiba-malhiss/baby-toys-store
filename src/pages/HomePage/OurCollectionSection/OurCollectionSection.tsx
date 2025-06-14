import styles from './our-collection-section.module.scss';
import Flex from '../../../components/layout/Flex/Flex.tsx';
import { Button } from '../../../components/common/Button/Button.tsx';
import { toyCategories } from '../../../mock-data/home-page.ts';
import Section from '../../../components/layout/Section/Section.tsx';

const OurCollectionSection = () => {
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
        {toyCategories.map(({ label, image }) => (
          <Button withoutPadding key={label} appearance="link" size="large" onClick={() => {}}>
            <Flex fullHeight direction="vertical" align="center" justify="between">
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
