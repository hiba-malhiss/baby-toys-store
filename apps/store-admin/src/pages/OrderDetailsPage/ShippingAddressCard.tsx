import React from 'react';
import { Card } from '@baby-toys/ui-kit';
import styles from './order-details-page.module.scss';
import { useTranslation } from 'react-i18next';

type Props = {
  order: any;
};

export const ShippingAddressCard: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const a = order?.shippingAddress;

  const rows = [
    { key: t('shippingAddress.firstName'), val: a?.firstName },
    { key: t('shippingAddress.lastName'), val: a?.lastName },
    { key: t('shippingAddress.town'), val: a?.townCode },
    { key: t('shippingAddress.region'), val: a?.region },
    { key: t('shippingAddress.detailedAddress'), val: a?.detailedAddress },
    { key: t('shippingAddress.phone'), val: a?.phoneNumber },
    { key: t('shippingAddress.secondPhone'), val: a?.secondPhoneNumber },
    { key: t('shippingAddress.email'), val: a?.email },
  ];

  return (
    <Card header={t('shippingAddress.title')} fullWidth className={styles.orderDetailsCardDelay3}>
      {!a ? (
        <span className={styles.orderDetailsNoCoupon}>{t('shippingAddress.noAddress')}</span>
      ) : (
        <>
          {rows.map(({ key, val }) => (
            <div key={key} className={styles.orderDetailsAddressRow}>
              <strong>{key}</strong>
              <span>{val || '—'}</span>
            </div>
          ))}
        </>
      )}
    </Card>
  );
};
