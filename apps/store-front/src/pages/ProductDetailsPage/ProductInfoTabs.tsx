import React from 'react';
import { TabBar, TabBarItem, Card, ExpandableContent } from '@baby-toys/ui-kit';
import styles from './product-details-page.module.scss';
import { ProductReviews } from './ProductReviews.tsx';
import type { UiProduct } from '../../api/normalizers/productNormalizer';
import { useStoreSettings } from '../../api/settingsApi';

export const ProductInfoTabs: React.FC<{ product: UiProduct }> = ({ product }) => {
  const { id, shortDescription, featureBullets, details } = product;
  const { data: settings } = useStoreSettings();

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
            {/* Short description */}
            {shortDescription && <p className="bts-marginBxl">{shortDescription}</p>}

            {/* Feature bullets */}
            {featureBullets?.length ? (
              <ul className={styles.productOverviewFeatureBullets}>
                {featureBullets.map((b, i) => (
                  <li key={`${b}-${i}`}>{b}</li>
                ))}
              </ul>
            ) : null}

            {/* Details key/value */}
            {details?.length ? (
              <div className={styles.productOverviewDetails}>
                {details.map(({ label, value }, index) => (
                  <React.Fragment key={`${label}-${index}`}>
                    <label>{label}</label>
                    <span>{value}</span>
                  </React.Fragment>
                ))}
              </div>
            ) : null}
          </ExpandableContent>
        </TabBarItem>

        <TabBarItem value="reviews">
          <ProductReviews productId={String(id)} />
        </TabBarItem>

        <TabBarItem value="order-cancellation">
          <ExpandableContent className={styles.productDetailsDescription}>
            {settings?.policies?.cancelPolicy || 'No cancellation policy available.'}
          </ExpandableContent>
        </TabBarItem>

        <TabBarItem value="return-policy">
          <ExpandableContent className={styles.productDetailsDescription}>
            {settings?.policies?.returnPolicy || 'No return policy available.'}
          </ExpandableContent>
        </TabBarItem>
      </TabBar>
    </Card>
  );
};
