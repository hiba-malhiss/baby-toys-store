import Flex from '../../../components/layout/Flex/Flex.tsx';
import styles from './newsletter-section.module.scss';
import { Input } from '../../../components/commmon/Input/Input.tsx';
import { Button } from '../../../components/commmon/Button/Button.tsx';
import Section from '../../../components/layout/Section/Section.tsx';

const NewsletterSection = () => {
  return (
    <Section title="Newsletter">
      <p className={styles.newsletterSectionDescription}>
        Get 15% off your first purchase! Plus, be the first to know about sales, new product
        launches, and exclusive offers!
      </p>
      <Flex spacing="m">
        <Input placeholder="Enter your email" className={styles.newsletterSectionInput} />
        <Button size="large" className={styles.newsletterSectionButton}>
          Join
        </Button>
      </Flex>
    </Section>
  );
};

export default NewsletterSection;
