import React from 'react';
import { Card, Flex, Heading } from '@baby-toys/ui-kit';

type Props = {
  note?: string | null;
};

export const ShippingNoteCard: React.FC<Props> = ({ note }) => {
  return (
    <Card header={<Heading level="h3">Order Note</Heading>} fullWidth>
      <Flex direction="vertical" spacing="s">
        <span>{note && note.trim() ? note : '-'}</span>
      </Flex>
    </Card>
  );
};
