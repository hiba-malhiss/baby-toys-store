import Section from '../../../components/features/Section/Section.tsx';
import { ReviewCard, Carousel } from '@baby-toys/ui-kit';
import { useHighlightedReviews } from '../../../api/reviewsApi';
import { BREAKPOINTS } from '@baby-toys/ui-kit/constants/breakpoints';

const CustomerReviewsSection = () => {
  const { data: featuredReviews = [], isLoading } = useHighlightedReviews();

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
