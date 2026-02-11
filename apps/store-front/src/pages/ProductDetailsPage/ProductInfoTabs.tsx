import React from 'react';
import { TabBar, TabBarItem, Card, ExpandableContent } from '@baby-toys/ui-kit';
import styles from './product-details-page.module.scss';
import { ProductReviews } from './ProductReviews.tsx';
import { useStoreSettings } from '../../api/settingsApi';
import { useTranslation } from 'react-i18next';
import type { Product } from "../../api/types/product.ts";

export const ProductInfoTabs: React.FC<{ product: Product }> = ({ product }) => {
  const { id, shortDescription, featureBullets, details } = product;
  const { data: settings } = useStoreSettings();
  const { t } = useTranslation('common');

  return (
    <Card fullWidth size="large">
      <TabBar
        tabs={[
          { header: t('product.tabs.description'), value: 'description' },
          { header: t('product.tabs.reviews'), value: 'reviews' },
          { header: t('product.tabs.cancelPolicy'), value: 'order-cancellation' },
          { header: t('product.tabs.returnPolicy'), value: 'return-policy' },
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
            {settings?.policies?.cancelPolicy || t('product.policies.noCancel')}
          </ExpandableContent>
        </TabBarItem>

        <TabBarItem value="return-policy">
          <ExpandableContent className={styles.productDetailsDescription}>
            {settings?.policies?.returnPolicy || t('product.policies.noReturn')}
          </ExpandableContent>
        </TabBarItem>
      </TabBar>
    </Card>
  );
};
