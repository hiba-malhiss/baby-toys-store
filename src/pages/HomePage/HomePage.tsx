import ShopNowSection from './ShopNowSection/ShopNowSection.tsx';
import OurCollectionSection from './OurCollectionSection/OurCollectionSection.tsx';
import Flex from '../../components/layout/Flex/Flex.tsx';
import TopPicksSection from './TopPicksSection/TopPicksSection.tsx';
import CustomerFeedbacksSection from './CustomerFeedbacks/CustomerFeedbacksSection.tsx';

const HomePage = () => {
  return (
    <Flex direction="vertical" spacing="xxl" fullWidth>
      <ShopNowSection />
      <OurCollectionSection />
      <TopPicksSection />
      <CustomerFeedbacksSection />
    </Flex>
  );
};

export default HomePage;
