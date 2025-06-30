import React, { useEffect, useState } from 'react';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { useMockProductsApi } from '../../../mock-data/useMockProductsApi.ts';
import { formatCountdown, useCountdown } from '../../../hooks/useCountdown.ts';
import { Alert } from '../../common/Alert/Alert.tsx';

const FlashSaleBanner: React.FC = () => {
  const { getFlashSale } = useMockProductsApi();
  const [flashSale, setFlashSale] = useState<any>(null);
  const [flashSaleEnd, setFlashSaleEnd] = useState<string | null>(null);
  const [flashSaleTitle, setFlashSaleTitle] = useState('');
  const [flashSaleMessage, setFlashSaleMessage] = useState('');
  const [flashSaleIcon, setFlashSaleIcon] = useState(faBolt);

  useEffect(() => {
    getFlashSale().then((data) => {
      setFlashSale(data);
      setFlashSaleEnd(data.endTime);
      setFlashSaleTitle(data.title);
      setFlashSaleMessage(data.message);
      setFlashSaleIcon(faBolt);
    });
  }, [getFlashSale]);

  const countdown = useCountdown(flashSaleEnd ? new Date(flashSaleEnd) : new Date());

  if (!flashSale || countdown.isExpired) return null;

  return (
    <Alert
      appearance="flash-sale"
      size="small"
      title={flashSaleTitle}
      message={flashSaleMessage}
      icon={flashSaleIcon}
      countdown={formatCountdown(countdown)}
      closable={false}
      isAnimated
    />
  );
};

export default FlashSaleBanner;
