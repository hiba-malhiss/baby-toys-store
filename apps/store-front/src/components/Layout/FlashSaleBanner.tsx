import React, { useEffect, useState } from 'react';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { formatCountdown, useCountdown } from '../../hooks/useCountdown.ts';
import { Alert } from '@baby-toys/ui-kit';
import { useMockProductsApi } from '@mock-data/useMockApi';

const FlashSaleBanner: React.FC = () => {
  const { getFlashSale } = useMockProductsApi();
  const [flashSale, setFlashSale] = useState<any>(null);

  useEffect(() => {
    getFlashSale().then(setFlashSale);
  }, [getFlashSale]);

  const countdown = useCountdown(flashSale?.endTime ? new Date(flashSale.endTime) : new Date());

  if (!flashSale || countdown.isExpired) return null;

  return (
    <Alert
      appearance="flash-sale"
      size="small"
      title={flashSale.title}
      message={flashSale.message}
      icon={faBolt}
      countdown={formatCountdown(countdown)}
      closable={false}
      isAnimated
    />
  );
};

export default FlashSaleBanner;
