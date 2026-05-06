import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Flex, Text, Divider, Button, BouncingDotsLoader } from '@baby-toys/ui-kit';
import type { ContactMessage } from '../../api/types/contact';

interface ContactMessageDialogProps {
  visible: boolean;
  onHide: () => void;
  message?: ContactMessage;
  isLoading?: boolean;
}

const ContactMessageDialog: React.FC<ContactMessageDialogProps> = ({
  visible,
  onHide,
  message,
  isLoading,
}) => {
  const { t } = useTranslation('common');
  const header = message
    ? t('app.contact.dialog.title', { id: message.id })
    : t('app.contact.dialog.defaultTitle');

  const footer = (
    <Flex justify="end">
      <Button onClick={onHide}>{t('app.common.close')}</Button>
    </Flex>
  );

  return (
    <Dialog visible={visible} onHide={onHide} header={header} footer={footer}>
      {isLoading || !message ? (
        <BouncingDotsLoader />
      ) : (
        <Flex direction="vertical" spacing="m" className="bts-paddingS">
          <Flex spacing="s" wrap>
            <Text weight="bold">{t('app.contact.dialog.from')}:</Text>
            <Text>{message.name}</Text>
          </Flex>
          <Flex spacing="s" wrap>
            <Text weight="bold">{t('app.contact.dialog.email')}:</Text>
            <Text>{message.email || '-'}</Text>
          </Flex>
          <Flex spacing="s" wrap>
            <Text weight="bold">{t('app.contact.dialog.phone')}:</Text>
            <Text>{message.phoneNumber || '-'}</Text>
          </Flex>
          <Flex spacing="s" wrap>
            <Text weight="bold">{t('app.contact.dialog.subject')}:</Text>
            <Text>{message.subject}</Text>
          </Flex>
          <Divider />
          <Flex direction="vertical" spacing="s">
            <Text weight="bold">{t('app.contact.dialog.message')}</Text>
            <Text>{message.message}</Text>
          </Flex>
        </Flex>
      )}
    </Dialog>
  );
};

export default ContactMessageDialog;
