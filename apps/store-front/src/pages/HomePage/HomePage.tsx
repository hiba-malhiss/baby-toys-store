import ShopNowSection from './features/ShopNowSection/ShopNowSection.tsx';
import OurCollectionSection from './features/OurCollectionSection/OurCollectionSection.tsx';
import TopPicksSection from './features/TopPicksSection/TopPicksSection.tsx';
import CustomerReviewsSection from './features/CustomerReviews/CustomerReviewsSection.tsx';
import BannersSection from './features/BannersSection/BannersSection.tsx';
import RecentPhotoShootsSection from './features/RecentPhotoShootsSection/RecentPhotoShootsSection.tsx';
import PolicyCardsSection from './features/PolicyCardsSection/PolicyCardsSection.tsx';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';

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
