import { useEffect, useState } from 'react';
import Section from '../../../components/shared/Section/Section.tsx';
import ReviewCard from '../../../components/common/ReviewCard/ReviewCard.tsx';
import styles from './customer-review-section.module.scss';
import Carousel from '../../../components/common/Carousel/Carousel.tsx';
import { useMockProductsApi } from '../../../mock-data/useMockProductsApi.ts';
import type { Review } from '../../../types/product.types.ts';

const CustomerReviewsSection = () => {
  const [featuredReviews, setFeaturedReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true); // <-- added loading state
  const { getTestimonials } = useMockProductsApi(5);

  useEffect(() => {
    setIsLoading(true);
    getTestimonials(5)
      .then((data) => {
        setFeaturedReviews(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [getTestimonials]);

  return (
    <Section
      title="Hear from Other Happy Parents"
      subTitle="Customer testimonials"
      compactPadding
      className={styles.customerReviews}
      isLoading={isLoading}
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
        itemTemplate={(review) => <ReviewCard review={review} fullHeight />}
      />
    </Section>
  );
};

export default CustomerReviewsSection;
