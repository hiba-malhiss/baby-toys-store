import { PageContainer } from '../../components/Layout/PageContainer/PageContainer.tsx';
import ShopNowSection from './ShopNowSection/ShopNowSection.tsx';
import CategoriesStrip from './CategoriesStrip/CategoriesStrip.tsx';
import PromoBanners from './PromoBanners/PromoBanners.tsx';
import BestSellingGrid from './BestSellingGrid/BestSellingGrid.tsx';
import CustomerReviewsSection from './CustomerReviews/CustomerReviewsSection.tsx';
import PolicyCardsSection from './PolicyCardsSection/PolicyCardsSection.tsx';

const HomePageV2 = () => {
  return (
    <>
      <ShopNowSection />
      <PageContainer>
        <CategoriesStrip />
        <PromoBanners />
        <BestSellingGrid />
        <CustomerReviewsSection />
        <PolicyCardsSection />
      </PageContainer>
    </>
  );
};

export default HomePageV2;
