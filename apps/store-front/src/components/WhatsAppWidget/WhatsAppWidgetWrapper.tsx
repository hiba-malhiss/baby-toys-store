import React from 'react';
import { WhatsAppWidget } from '@baby-toys/ui-kit';
import { useStoreSettings } from '../../api/settingsApi';

interface Props {
  position?: 'bottom-right' | 'bottom-left';
  defaultMessage?: string;
}

const WhatsAppWidgetWrapper: React.FC<Props> = ({ position = 'bottom-right', defaultMessage }) => {
  const { data: settings } = useStoreSettings();
  const phone = (settings?.contact as any)?.phone as string | undefined;

  if (!phone) return null;

  return (
    <WhatsAppWidget phoneNumber={phone} defaultMessage={defaultMessage} position={position} />
  );
};

export default WhatsAppWidgetWrapper;
