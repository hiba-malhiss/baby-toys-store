import { useCallback } from 'react';
import { useStoreConfiguration } from '../context/StoreConfigurationContext.tsx';
import { formatNumber } from '@baby-toys/ui-kit/utils';

export const useCurrencyFormatter = () => {
  const { currency } = useStoreConfiguration();

  return useCallback(
    (amount: number): string => {
      if (typeof amount !== 'number' || isNaN(amount)) {
        return formatNumber(0, currency?.currency);
      }
      return formatNumber(amount, currency?.currency);
    },
    [currency?.currency]
  );
};
