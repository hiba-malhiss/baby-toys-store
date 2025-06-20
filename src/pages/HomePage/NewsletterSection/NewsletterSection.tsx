import Flex from '../../../components/common/Flex/Flex.tsx';
import styles from './newsletter-section.module.scss';
import { StringInput } from '../../../components/common/StringInput/StringInput.tsx';
import { Button } from '../../../components/common/Button/Button.tsx';
import Section from '../../../components/layout/Section/Section.tsx';

const NewsletterSection = () => {
  return (
    <Section title="Newsletter">
      <p className={styles.newsletterSectionDescription}>
        Get 15% off your first purchase! Plus, be the first to know about sales, new product
        launches, and exclusive offers!
      </p>
      <Flex spacing="m">
        <StringInput
          placeholder="Enter your email"
          size="large"
          className={styles.newsletterSectionInput}
        />
        <Button size="large">Join</Button>
      </Flex>
    </Section>
  );
};

export default NewsletterSection;
