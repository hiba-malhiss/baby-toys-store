import React from 'react';
import { ExpandableContent, AccordionGroup, Accordion, Flex, Heading } from '@baby-toys/ui-kit';
import { Star, XCircle, RefreshCcw } from 'lucide-react';
import styles from './product-details-page.module.scss';
import { ProductReviews } from './ProductReviews.tsx';
import { useStoreSettings } from '../../api/settingsApi';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../api/types/product.ts';

export const ProductInfoTabs: React.FC<{ product: Product }> = ({ product }) => {
  const { id, description } = product;
  const { data: settings } = useStoreSettings();
  const { t } = useTranslation('common');

  const renderHeader = (IconComponent: React.FC<any>, label: string) => (
    <Flex align="center" spacing="s">
      <IconComponent size={18} />
      {label}
    </Flex>
  );

  return (
    <>
      <div className={styles.productDetailsCard}>
        <Flex direction="vertical" spacing="m">
          <Heading level="h5">{t('product.tabs.description')}</Heading>
          <ExpandableContent className={styles.productDetailsDescription}>
            {description && <p className="bts-marginBxl">{description}</p>}
          </ExpandableContent>
        </Flex>
      </div>

      <AccordionGroup allowMultipleOpen>
        <Accordion header={renderHeader(Star, t('product.tabs.reviews'))}>
          <ProductReviews productId={String(id)} />
        </Accordion>

        <Accordion header={renderHeader(XCircle, t('product.tabs.cancelPolicy'))}>
          <ExpandableContent className={styles.productDetailsDescription}>
            {settings?.policies?.cancelPolicy || t('product.policies.noCancel')}
          </ExpandableContent>
        </Accordion>

        <Accordion header={renderHeader(RefreshCcw, t('product.tabs.returnPolicy'))}>
          <ExpandableContent className={styles.productDetailsDescription}>
            {settings?.policies?.returnPolicy || t('product.policies.noReturn')}
          </ExpandableContent>
        </Accordion>
      </AccordionGroup>
    </>
  );
};
