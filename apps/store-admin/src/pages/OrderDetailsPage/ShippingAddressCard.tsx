import React from 'react';
import { Card, Flex, Heading } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';

type Props = {
  order: any;
};

export const ShippingAddressCard: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const a = order?.shippingAddress;
  return (
    <Card header={<Heading level="h3">{t('shippingAddress.title')}</Heading>} fullWidth>
      {!a ? (
        <span>{t('shippingAddress.noAddress')}</span>
      ) : (
        <Flex direction="vertical" spacing="m">
          <Flex justify="between" spacing="s">
            <strong>{t('shippingAddress.firstName')}</strong>
            <span>{a.firstName || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>{t('shippingAddress.lastName')}</strong>
            <span>{a.lastName || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>{t('shippingAddress.town')}</strong>
            <span>{a.town || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>{t('shippingAddress.region')}</strong>
            <span>{a.region || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>{t('shippingAddress.detailedAddress')}</strong>
            <span>{a.detailedAddress || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>{t('shippingAddress.phone')}</strong>
            <span>{a.phoneNumber || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>{t('shippingAddress.secondPhone')}</strong>
            <span>{a.secondPhoneNumber || '-'}</span>
          </Flex>
          <Flex justify="between" spacing="s">
            <strong>{t('shippingAddress.email')}</strong>
            <span>{a.email || '-'}</span>
          </Flex>
        </Flex>
      )}
    </Card>
  );
};
