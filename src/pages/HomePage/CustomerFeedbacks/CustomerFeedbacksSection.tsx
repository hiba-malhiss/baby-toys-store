import Section from '../../../components/layout/Section/Section.tsx';
import { feedbacks } from '../../../mock-data/feedback.ts';
import FeedbackCard from '../../../components/commmon/FeedbackCard/FeedbackCard.tsx';
import styles from './customer-feedbacks-section.module.scss';
import Carousel from '../../../components/commmon/Carousel/Carousel.tsx';

const CustomerFeedbacksSection = () => {
  return (
    <Section title="Hear from Other Happy Parents" subTitle="Customer testimonials">
      <Carousel
        className={styles.customerFeedbacks}
        items={feedbacks}
        numVisible={3}
        orientation="horizontal"
        showNavigation
        itemTemplate={(feedback) => <FeedbackCard feedback={feedback} fullHeight />}
      />
    </Section>
  );
};

export default CustomerFeedbacksSection;
