import React from 'react';
import { Card, Flex, Heading } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';

type Props = {
  note?: string | null;
};

export const ShippingNoteCard: React.FC<Props> = ({ note }) => {
  const { t } = useTranslation();
  return (
    <Card header={<Heading level="h3">{t('orderNote.title')}</Heading>} fullWidth>
      <Flex direction="vertical" spacing="s">
        <span>{note && note.trim() ? note : '-'}</span>
      </Flex>
    </Card>
  );
};
