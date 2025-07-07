import { useCallback } from 'react';
import { useStoreConfiguration } from '../context/StoreConfigurationContext.tsx';

export const useCurrencyFormatter = () => {
  const { currency } = useStoreConfiguration();

  return useCallback(
    (amount: number): string => {
      if (typeof amount !== 'number' || isNaN(amount)) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency?.currency || 'USD',
        }).format(0);
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency?.currency || 'USD',
      }).format(amount);
    },
    [currency?.currency]
  );
};
