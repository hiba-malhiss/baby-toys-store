import { useEffect, useState } from 'react';
import Section from '../../../components/features/Section/Section.tsx';
import { ReviewCard, Carousel } from '@baby-toys/ui-kit/components';
import { useMockProductsApi } from '@mock-data/useMockApi';
import type { Review } from '../../../types/product.types.ts';
import { BREAKPOINTS } from '@baby-toys/ui-kit/constants/breakpoints';

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
      isLoading={isLoading}
    >
      <Carousel
        items={featuredReviews}
        numVisible={4}
        orientation="horizontal"
        showNavigation
        responsiveOptions={[
          { breakpoint: BREAKPOINTS.large, numVisible: 3 },
          { breakpoint: BREAKPOINTS.medium, numVisible: 2 },
          { breakpoint: BREAKPOINTS.small, numVisible: 1 },
        ]}
        itemTemplate={(review) => <ReviewCard review={review} fullHeight />}
      />
    </Section>
  );
};

export default CustomerReviewsSection;
