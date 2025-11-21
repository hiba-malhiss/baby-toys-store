import React from 'react';
import { Card, Flex, Heading } from '@baby-toys/ui-kit';

type Props = {
  order: any;
};

export const ShippingAddressCard: React.FC<Props> = ({ order }) => {
  const a = order?.shippingAddress;
  return (
    <Card header={<Heading level="h3">Shipping Address</Heading>} fullWidth>
      {!a ? (
        <span>No address</span>
      ) : (
        <Flex direction="vertical" spacing="m">
          <Flex justify="between" spacing="s">
            <strong>First Name</strong>
            <span>{a.firstName || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>Last Name</strong>
            <span>{a.lastName || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>Town</strong>
            <span>{a.town || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>Region</strong>
            <span>{a.region || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>Detailed Address</strong>
            <span>{a.detailedAddress || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>Phone Number</strong>
            <span>{a.phoneNumber || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>Second Phone Number</strong>
            <span>{a.secondPhoneNumber || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>Email</strong>
            <span>{a.email || '-'}</span>
          </Flex>
        </Flex>
      )}
    </Card>
  );
};
