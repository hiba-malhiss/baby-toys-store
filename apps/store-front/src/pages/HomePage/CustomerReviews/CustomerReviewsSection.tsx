import Section from '../../../components/features/Section/Section.tsx';
import { ReviewCard, Carousel } from '@baby-toys/ui-kit';
import { useHighlightedReviews } from '../../../api/reviewsApi';
import { BREAKPOINTS } from '@baby-toys/ui-kit/constants/breakpoints';
import { useTranslation } from 'react-i18next';

const CustomerReviewsSection = () => {
  const { data: featuredReviews = [], isLoading } = useHighlightedReviews();
  const { t } = useTranslation('common');

  return (
    <Section
      title={t('home.reviews.title')}
      subTitle={t('home.reviews.subtitle')}
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
