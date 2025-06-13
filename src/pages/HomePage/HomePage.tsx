import ShopNowSection from './ShopNowSection/ShopNowSection.tsx';
import OurCollectionSection from './OurCollectionSection/OurCollectionSection.tsx';
import Flex from '../../components/layout/Flex/Flex.tsx';
import TopPicksSection from './TopPicksSection/TopPicksSection.tsx';
import CustomerFeedbacksSection from './CustomerFeedbacks/CustomerFeedbacksSection.tsx';
import BannersSection from './BannersSection/BannersSection.tsx';
import RecentPhotoShootsSection from './RecentPhotoShootsSection/RecentPhotoShootsSection.tsx';
import PolicyCardsSection from './PolicyCardsSection/PolicyCardsSection.tsx';
import NewsletterSection from './NewsletterSection/NewsletterSection.tsx';
import styles from './home-page.module.scss';

const HomePage = () => {
  return (
    <Flex direction="vertical" align="center" spacing="xxl" fullWidth>
      <ShopNowSection />
      <Flex direction="vertical" spacing="xxl" className={styles.homeContent}>
        <OurCollectionSection />
        <TopPicksSection />
        <BannersSection />
        <CustomerFeedbacksSection />
        <RecentPhotoShootsSection />
        <PolicyCardsSection />
        <NewsletterSection />
      </Flex>
    </Flex>
  );
};

export default HomePage;
