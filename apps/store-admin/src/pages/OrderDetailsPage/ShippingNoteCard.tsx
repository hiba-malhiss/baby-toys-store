import React from 'react';
import { Card } from '@baby-toys/ui-kit';
import styles from './order-details-page.module.scss';
import { useTranslation } from 'react-i18next';

type Props = {
  note?: string | null;
};

export const ShippingNoteCard: React.FC<Props> = ({ note }) => {
  const { t } = useTranslation();
  const hasNote = note && note.trim();

  return (
    <Card header={t('orderNote.title')} fullWidth className={styles.orderDetailsCardDelay4}>
      <div
        className={`${styles.orderDetailsNoteBody} ${
          !hasNote ? styles.orderDetailsNoteBodyEmpty : ''
        }`}
      >
        {hasNote ? note : '—'}
      </div>
    </Card>
  );
};
