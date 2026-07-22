import { PageContainer } from '../../components/Layout/PageContainer/PageContainer.tsx';
import HeroCarousel from './HeroCarousel/HeroCarousel.tsx';
import OurCollectionSection from './OurCollectionSection/OurCollectionSection.tsx';
import TopPicksV2 from './TopPicksV2/TopPicksV2.tsx';
import CustomerReviewsSection from './CustomerReviews/CustomerReviewsSection.tsx';
import PolicyCardsSection from './PolicyCardsSection/PolicyCardsSection.tsx';

const HomePageV2 = () => {
  return (
    <>
      <HeroCarousel />
      <PageContainer>
        <OurCollectionSection />
        <TopPicksV2 />
        <CustomerReviewsSection />
        <PolicyCardsSection />
      </PageContainer>
    </>
  );
};

export default HomePageV2;
