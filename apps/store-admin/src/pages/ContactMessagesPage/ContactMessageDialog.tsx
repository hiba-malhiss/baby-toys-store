import React from 'react';
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
  const header = message ? `Message #${message.id}` : 'Message';

  return (
    <Dialog visible={visible} onHide={onHide} header={header}>
      {isLoading || !message ? (
        <BouncingDotsLoader />
      ) : (
        <Flex direction="vertical" spacing="m" className="bts-paddingS">
          <Flex spacing="s" wrap>
            <Text weight="bold">From:</Text>
            <Text>{message.name}</Text>
          </Flex>
          <Flex spacing="s" wrap>
            <Text weight="bold">Email:</Text>
            <Text>{message.email || '-'}</Text>
          </Flex>
          <Flex spacing="s" wrap>
            <Text weight="bold">Phone Number:</Text>
            <Text>{message.phoneNumber || '-'}</Text>
          </Flex>
          <Flex spacing="s" wrap>
            <Text weight="bold">Subject:</Text>
            <Text>{message.subject}</Text>
          </Flex>
          <Divider />
          <Flex direction="vertical" spacing="s">
            <Text weight="bold">Message</Text>
            <Text>{message.message}</Text>
          </Flex>
          <Flex justify="end" className="bts-marginTml">
            <Button onClick={onHide}>Close</Button>
          </Flex>
        </Flex>
      )}
    </Dialog>
  );
};

export default ContactMessageDialog;
