import { TabBar } from '../../components/common/TabBar/TabBar.tsx';
import { TabBarItem } from '../../components/common/TabBar/TabBarItem.tsx';
import styles from './product-details-page.module.scss';
import { description } from '../../mock-data/product-details-page.ts';
import Card from '../../components/common/Card/Card.tsx';
import { feedbacks } from '../../mock-data/home-page.ts';
import FeedbackCard from '../../components/common/FeedbackCard/FeedbackCard.tsx';
import { ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import ExpandableContent from '../../components/common/ExpandableContent/ExpandableContent.tsx';

export const ProductInfoTabs = () => {
  return (
    <Card fullWidth size="large">
      <TabBar
        tabs={[
          { header: 'Description', value: 'description' },
          { header: 'Reviews', value: 'reviews' },
          { header: 'Cancellation Policy', value: 'order-cancellation' },
          { header: 'Return Policy', value: 'return-policy' },
        ]}
        defaultSelected="description"
      >
        <TabBarItem value="description">
          <ExpandableContent className={styles.productDetailsDescription}>
            {description}
          </ExpandableContent>
        </TabBarItem>
        <TabBarItem value="reviews">
          <ViewSwitcher gap="none" pageSize={4} staticView="list" totalSize={feedbacks.length}>
            {feedbacks.map((feedback) => (
              <FeedbackCard feedback={feedback} appearance="detailed"></FeedbackCard>
            ))}
          </ViewSwitcher>
        </TabBarItem>
        <TabBarItem value="order-cancellation">
          <ExpandableContent className={styles.productDetailsDescription}>
            {description}
          </ExpandableContent>
        </TabBarItem>
        <TabBarItem value="return-policy">
          <ExpandableContent className={styles.productDetailsDescription}>
            {description}
          </ExpandableContent>
        </TabBarItem>
      </TabBar>
    </Card>
  );
};
