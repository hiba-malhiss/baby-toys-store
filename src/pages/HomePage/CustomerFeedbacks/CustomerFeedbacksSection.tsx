import Section from '../../../components/layout/Section/Section.tsx';
import FeedbackCard from '../../../components/common/FeedbackCard/FeedbackCard.tsx';
import styles from './customer-feedbacks-section.module.scss';
import Carousel from '../../../components/common/Carousel/Carousel.tsx';
import { feedbacks } from '../../../mock-data/home-page.ts';

const CustomerFeedbacksSection = () => {
  return (
    <Section
      title="Hear from Other Happy Parents"
      subTitle="Customer testimonials"
      compactPadding
      className={styles.customerFeedbacks}
    >
      <Carousel
        items={feedbacks}
        numVisible={4}
        orientation="horizontal"
        showNavigation
        responsiveOptions={[
          { breakpoint: '1400', numVisible: 3 },
          { breakpoint: '900', numVisible: 2 },
          { breakpoint: '600', numVisible: 1 },
        ]}
        itemTemplate={(feedback) => <FeedbackCard feedback={feedback} fullHeight />}
      />
    </Section>
  );
};

export default CustomerFeedbacksSection;
