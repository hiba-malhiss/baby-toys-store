import { useCallback } from 'react';
import { useStoreConfiguration } from '../context/StoreConfigurationContext.tsx';

export const useCurrencyFormatter = () => {
  const { currency } = useStoreConfiguration();
  const symbol = currency?.symbol;

  return useCallback(
    (amount: number): string => {
      if (typeof amount !== 'number' || isNaN(amount)) {
        return `${symbol}0.00`;
      }
      return `${symbol}${amount.toFixed(2)}`;
    },
    [symbol]
  );
};
