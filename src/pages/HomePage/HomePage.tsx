import ShopNowSection from './ShopNowSection/ShopNowSection.tsx';
import OurCollectionSection from './OurCollectionSection/OurCollectionSection.tsx';
import Flex from '../../components/layout/Flex/Flex.tsx';
import TopPicksSection from './TopPicksSection/TopPicksSection.tsx';
import CustomerFeedbacksSection from './CustomerFeedbacks/CustomerFeedbacksSection.tsx';
import BannersSection from './BannersSection/BannersSection.tsx';
import RecentPhotoShoots from './RecentPhotoShoots/RecentPhotoShoots.tsx';

const HomePage = () => {
  return (
    <Flex direction="vertical" spacing="xxl" fullWidth>
      <ShopNowSection />
      <OurCollectionSection />
      <TopPicksSection />
      <BannersSection />
      <CustomerFeedbacksSection />
      <RecentPhotoShoots />
    </Flex>
  );
};

export default HomePage;
