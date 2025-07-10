import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import ShopNowSection from './ShopNowSection/ShopNowSection.tsx';
import OurCollectionSection from './OurCollectionSection/OurCollectionSection.tsx';
import TopPicksSection from './TopPicksSection/TopPicksSection.tsx';
import BannersSection from './BannersSection/BannersSection.tsx';
import CustomerReviewsSection from './CustomerReviews/CustomerReviewsSection.tsx';
import RecentPhotoShootsSection from './RecentPhotoShootsSection/RecentPhotoShootsSection.tsx';
import PolicyCardsSection from './PolicyCardsSection/PolicyCardsSection.tsx';

const HomePage = () => {
  return (
    <>
      <ShopNowSection />
      <PageContainer>
        <OurCollectionSection />
        <TopPicksSection />
        <BannersSection />
        <CustomerReviewsSection />
        <RecentPhotoShootsSection />
        <PolicyCardsSection />
      </PageContainer>
    </>
  );
};

export default HomePage;
