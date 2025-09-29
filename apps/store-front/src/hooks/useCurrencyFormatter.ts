import { useCallback } from 'react';
import { useStoreSettings } from '../api/settingsApi';

export const useCurrencyFormatter = (symbolOverride?: string) => {
  const { data: settings } = useStoreSettings();
  const symbol = symbolOverride ?? settings?.general?.currencySymbol;

  return useCallback(
    (amount: number): string => {
      const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
      const fixed = Number(val).toFixed(2);
      return symbol ? `${symbol}${fixed}` : fixed;
    },
    [symbol]
  );
};
