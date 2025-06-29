import { useEffect, useState } from 'react';
import Section from '../../../components/layout/Section/Section.tsx';
import FeedbackCard from '../../../components/common/FeedbackCard/FeedbackCard.tsx';
import styles from './customer-feedbacks-section.module.scss';
import Carousel from '../../../components/common/Carousel/Carousel.tsx';
import { useMockProductsApi } from '../../../mock-data/useMockProductsApi.ts';
import type { Feedback } from '../../../types/product.types.ts';

const CustomerFeedbacksSection = () => {
  const [featuredReviews, setFeaturedReviews] = useState<Feedback[]>([]);
  const { getTestimonials } = useMockProductsApi(5);

  useEffect(() => {
    getTestimonials(5).then(setFeaturedReviews);
  }, [getTestimonials]);

  return (
    <Section
      title="Hear from Other Happy Parents"
      subTitle="Customer testimonials"
      compactPadding
      className={styles.customerFeedbacks}
    >
      <Carousel
        items={featuredReviews}
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